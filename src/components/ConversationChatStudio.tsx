import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Search,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  Bot,
  User,
  Terminal,
  FileText,
  FileSpreadsheet,
  Code2,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Pin,
  Share2,
  ArrowRight,
  ShieldCheck,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Paperclip,
  Upload,
  X,
  Image as ImageIcon,
  File as FileIcon,
  Eye,
  Music,
  Archive,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { 
  ConversationSession, 
  ChatMessage, 
  ProjectDeliverable, 
  CognitiveEngineMode,
  ChatAttachment 
} from '../types/agent';

interface ConversationChatStudioProps {
  conversations: ConversationSession[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onSendMessage: (message: string, engineMode?: CognitiveEngineMode, attachments?: ChatAttachment[]) => Promise<void>;
  isLoading: boolean;
  onNavigateToTab?: (tab: 'control' | 'email' | 'tasks' | 'projects' | 'computer' | 'security' | 'benchmark' | 'sandbox') => void;
}

export const ConversationChatStudio: React.FC<ConversationChatStudioProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onSendMessage,
  isLoading,
  onNavigateToTab
}) => {
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [openThoughtMap, setOpenThoughtMap] = useState<Record<string, boolean>>({});
  const [selectedEngine, setSelectedEngine] = useState<CognitiveEngineMode>('deep_research');
  const [isListening, setIsListening] = useState(false);
  
  // Attachments State
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<ChatAttachment | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading, attachments.length]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Format bytes to KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper to read file content into text or base64 data URL
  const readFileContent = (file: File, isImage: boolean, category: string): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      const ext = (file.name.split('.').pop() || '').toLowerCase();

      // Read as text for code, tabular data, JSON, markdown, and text documents
      if (
        category === 'code' ||
        category === 'data' ||
        ['txt', 'md', 'json', 'csv', 'tsv', 'xml', 'log', 'env', 'sql', 'yaml', 'yml'].includes(ext)
      ) {
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsText(file);
      } else {
        // Read as Data URL (base64) for images, PDFs, Word, audio, archives
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      }
    });
  };

  // Process incoming files from file picker, drag & drop, or clipboard paste
  const processFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const newAttachments: ChatAttachment[] = [];

    for (const file of files) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isImg = file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext);

      let category: ChatAttachment['category'] = 'other';
      if (isImg) {
        category = 'image';
      } else if (['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'md'].includes(ext)) {
        category = 'document';
      } else if (['csv', 'xlsx', 'xls', 'tsv', 'json', 'xml'].includes(ext)) {
        category = 'data';
      } else if (['py', 'ts', 'tsx', 'js', 'jsx', 'html', 'css', 'sql', 'sh', 'bash', 'c', 'cpp', 'h', 'java', 'rs', 'go', 'php', 'rb', 'yml', 'yaml', 'env'].includes(ext)) {
        category = 'code';
      } else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
        category = 'audio';
      } else if (['zip', 'tar', 'gz', '7z', 'rar'].includes(ext)) {
        category = 'archive';
      }

      const content = await readFileContent(file, isImg, category);

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || `application/${ext || 'octet-stream'}`,
        content,
        isImage: isImg,
        category
      });
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset input value so same file can be re-selected if desired
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleDownloadAttachment = (att: ChatAttachment) => {
    let url = att.content;
    if (!url.startsWith('data:') && !url.startsWith('blob:')) {
      const blob = new Blob([att.content], { type: att.type || 'text/plain;charset=utf-8' });
      url = URL.createObjectURL(blob);
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = att.name;
    link.click();
  };

  // Clipboard paste support
  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      e.preventDefault();
      processFiles(e.clipboardData.files);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Web Speech API for voice dictation
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Por favor usa Google Chrome o Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Text-to-Speech reader in Spanish
  const handleToggleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Código omitido para lectura oral.')
      .replace(/[#*_`]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .slice(0, 800);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDeliverable = (del: ProjectDeliverable) => {
    let mimeType = 'text/plain;charset=utf-8';
    if (del.fileType === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (del.fileType === 'xlsx') mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (del.fileType === 'pdf') mimeType = 'application/pdf';
    else if (del.fileType === 'json') mimeType = 'application/json';

    const blob = new Blob([del.content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = del.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportConversation = () => {
    if (!activeConversation) return;
    const markdown = `# ${activeConversation.title}
Fecha: ${activeConversation.createdAt}
Exportado desde: Curto's AI

${activeConversation.messages.map(m => `### ${m.role === 'user' ? '👤 Usuario' : "🤖 Curto's AI"} (${m.timestamp})\n\n${m.content}\n`).join('\n---\n\n')}
`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeConversation.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if ((!trimmed && attachments.length === 0) || isLoading) return;

    const currentMsg = trimmed;
    const currentAtts = [...attachments];

    setInputText('');
    setAttachments([]);

    await onSendMessage(
      currentMsg, 
      selectedEngine, 
      currentAtts.length > 0 ? currentAtts : undefined
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const toggleThought = (id: string) => {
    setOpenThoughtMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-pink-400" />;
      case 'code':
        return <Code2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'data':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-cyan-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-amber-400" />;
      case 'archive':
        return <Archive className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <FileIcon className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Render markdown text nicely with code blocks and bolding
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].trim();
        const code = lines.slice(lang ? 1 : 0).join('\n');
        const codeId = `code-${idx}-${code.slice(0, 10)}`;

        return (
          <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                {lang || 'code'}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(code, codeId)}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {copiedId === codeId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar código</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const textLines = part.split('\n');
      return (
        <div key={idx} className="space-y-2 text-sm leading-relaxed">
          {textLines.map((line, lineIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lineIdx} className="text-base font-bold text-white mt-3 mb-1">{line.slice(4)}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lineIdx} className="text-lg font-extrabold text-cyan-300 mt-4 mb-2">{line.slice(3)}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={lineIdx} className="text-xl font-black text-white mt-4 mb-2">{line.slice(2)}</h1>;
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-200">
                  <span className="text-cyan-400 font-bold shrink-0">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
                </div>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              const num = line.match(/^(\d+\.)\s/)?.[1] || '1.';
              const rest = line.replace(/^\d+\.\s/, '');
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-2 text-slate-200">
                  <span className="text-indigo-400 font-semibold shrink-0">{num}</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInline(rest) }} />
                </div>
              );
            }
            if (line.trim() === '') {
              return <div key={lineIdx} className="h-1.5" />;
            }
            return (
              <p key={lineIdx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
            );
          })}
        </div>
      );
    });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-200 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs">$1</code>');
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[600px] max-h-[850px]"
    >
      {/* Hidden File Input supporting all files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag & Drop Full-Frame Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-950/85 backdrop-blur-md border-2 border-dashed border-cyan-400 rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-none">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Suelta aquí tus archivos para analizarlos</h3>
          <p className="text-xs sm:text-sm text-cyan-200 max-w-md">
            Sube código (Python, TS, SQL), documentos (PDF, Word, TXT), hojas de cálculo (Excel, CSV), imágenes, audio o cualquier archivo para inspección instantánea con Curto's AI.
          </p>
        </div>
      )}

      {/* Top Banner / Bar */}
      <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition cursor-pointer"
            title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial de conversaciones"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 text-cyan-400" /> : <PanelLeftOpen className="w-4 h-4 text-cyan-400" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate max-w-[160px] sm:max-w-xs">
                  {activeConversation?.title || "Conversación"}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Activo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Curto's AI responde cualquier pregunta y analiza todo tipo de archivos
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition cursor-pointer shadow-sm"
            title="Subir archivos (PDF, Excel, Código, Imágenes, etc.)"
          >
            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Subir Archivo</span>
          </button>

          {/* New chat button */}
          <button
            type="button"
            onClick={onCreateNewConversation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo Chat</span>
          </button>

          {/* Export conversation */}
          {activeConversation && activeConversation.messages.length > 0 && (
            <button
              type="button"
              onClick={handleExportConversation}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Exportar conversación a Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Body: Sidebar + Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversation History */}
        {isSidebarOpen && (
          <aside className="w-72 sm:w-80 border-r border-slate-800/80 bg-slate-950 flex flex-col shrink-0">
            {/* Search and New Chat */}
            <div className="p-3 border-b border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={onCreateNewConversation}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Iniciar Nueva Conversación</span>
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Buscar en el historial..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-cyan-500/60"
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List of Conversations */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No hay conversaciones que coincidan con la búsqueda.
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = conv.id === activeConversationId;
                  const isEditing = editingTitleId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 border border-cyan-500/40 text-white shadow-sm'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editTitleValue}
                              onChange={e => setEditTitleValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  onRenameConversation(conv.id, editTitleValue);
                                  setEditingTitleId(null);
                                }
                              }}
                              className="bg-slate-900 text-xs text-white px-2 py-0.5 rounded border border-cyan-500 w-full focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onRenameConversation(conv.id, editTitleValue);
                                setEditingTitleId(null);
                              }}
                              className="p-1 text-cyan-400 hover:text-cyan-300"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-semibold truncate leading-snug">
                                {conv.title}
                              </h4>
                              {conv.pinned && (
                                <Pin className="w-3 h-3 text-cyan-400 shrink-0 ml-1 fill-cyan-400/20" />
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                              <span>{conv.updatedAt || conv.createdAt}</span>
                              <span className="font-mono text-slate-400">{conv.messages.length} msgs</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Hover Actions */}
                      {!isEditing && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTitleId(conv.id);
                              setEditTitleValue(conv.title);
                            }}
                            className="p-1 text-slate-400 hover:text-cyan-400 transition"
                            title="Renombrar conversación"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          {conversations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteConversation(conv.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 transition"
                              title="Eliminar conversación"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Status */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Curto's AI Conectado</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">v3.0.0</span>
            </div>
          </aside>
        )}

        {/* Right Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/30 min-w-0">
          {/* Active Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
            {(!activeConversation || activeConversation.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto p-6 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 animate-pulse">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    ¿Qué deseas resolver con <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Curto's AI</span>?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-md mx-auto">
                    Haz preguntas sobre cualquier tema, sincroniza tu buzón de Outlook institucional o <strong>sube todo tipo de archivos</strong> (PDF, Excel, Python, imágenes, Word) para analizarlos al instante.
                  </p>
                </div>

                {/* Quick Starter Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/30 text-left text-xs text-slate-300 hover:text-white transition group cursor-pointer shadow-sm"
                  >
                    <span className="font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      Subir cualquier archivo
                    </span>
                    <span className="text-[11px] text-slate-400">PDFs, Word, Excel, CSV, Código, Imágenes, Audio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendMessage('¿Qué correos urgentes tengo en mi cuenta a01425929@tec.mx de Outlook y qué acciones debo tomar?')}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition group cursor-pointer"
                  >
                    <span className="font-semibold text-sky-400 flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5" />
                      Outlook a01425929@tec.mx
                    </span>
                    <span className="text-[11px] text-slate-400">Revisar entregas del Prof. Garza y coordinar respuestas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendMessage('Escribe una función de optimización de datos en Python con tipado estricto y pruebas unitarias')}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition group cursor-pointer"
                  >
                    <span className="font-semibold text-purple-400 flex items-center gap-1.5 mb-1">
                      <Code2 className="w-3.5 h-3.5" />
                      Desarrollo en Python / Devin
                    </span>
                    <span className="text-[11px] text-slate-400">Código limpio, auto-reparable y listo para ejecutar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendMessage('Genera un informe ejecutivo formal en .docx en /Documentos con resumen de métricas y riesgos')}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 text-left text-xs text-slate-300 hover:text-white transition group cursor-pointer"
                  >
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      Crear Documento Word .docx
                    </span>
                    <span className="text-[11px] text-slate-400">Fábrica de documentos formal y descargable</span>
                  </button>
                </div>
              </div>
            ) : (
              activeConversation.messages.map(msg => {
                const isUser = msg.role === 'user';
                const isThoughtOpen = openThoughtMap[msg.id];
                const isSpeaking = speakingMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar */}
                    <div className="shrink-0 mt-1">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Bubble Content */}
                    <div className={`space-y-2 max-w-2xl sm:max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Role and Timestamp Header */}
                      <div className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-semibold text-slate-300">
                          {isUser ? 'Tú' : (msg.roleActive || "Curto's AI Superintelligence")}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`rounded-2xl p-4 sm:p-5 shadow-lg ${
                          isUser
                            ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white rounded-tr-none'
                            : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        {/* Attachments inside user or assistant message */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mb-3 space-y-2">
                            <div className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isUser ? 'text-cyan-200' : 'text-cyan-400'}`}>
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>{msg.attachments.length} archivo(s) adjunto(s):</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {msg.attachments.map(att => (
                                <div
                                  key={att.id}
                                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                                    isUser
                                      ? 'bg-indigo-950/70 border-indigo-400/30 text-white'
                                      : 'bg-slate-950 border-slate-800 text-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {att.isImage && att.content && att.content.startsWith('data:') ? (
                                      <img
                                        src={att.content}
                                        alt={att.name}
                                        onClick={() => setPreviewAttachment(att)}
                                        className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:opacity-80 transition shrink-0"
                                      />
                                    ) : (
                                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                                        {getCategoryIcon(att.category)}
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <div className="font-semibold truncate">{att.name}</div>
                                      <div className={`text-[10px] font-mono ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                                        {formatFileSize(att.size)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewAttachment(att)}
                                      className="p-1 rounded hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer"
                                      title="Previsualizar archivo"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadAttachment(att)}
                                      className="p-1 rounded hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer"
                                      title="Descargar archivo"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Message Text */}
                        {isUser ? (
                          <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="space-y-3">
                            {renderFormattedContent(msg.content)}

                            {/* Collapsible Deep Reasoning Panel */}
                            {msg.thoughtProcess && (
                              <div className="mt-3 pt-3 border-t border-slate-800/80">
                                <button
                                  type="button"
                                  onClick={() => toggleThought(msg.id)}
                                  className="flex items-center space-x-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>{isThoughtOpen ? 'Ocultar razonamiento cognitivo' : 'Ver razonamiento de Curto\'s AI'}</span>
                                  {isThoughtOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                                {isThoughtOpen && (
                                  <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-cyan-900/40 text-xs text-cyan-200/90 font-mono leading-relaxed space-y-1">
                                    <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">Tree-of-Thought & Análisis:</div>
                                    <p>{msg.thoughtProcess}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Generated Deliverables Cards */}
                            {msg.deliverables && msg.deliverables.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Archivos Generados en tu Sistema ({msg.deliverables.length})</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                  {msg.deliverables.map((del, dIdx) => (
                                    <div
                                      key={dIdx}
                                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                          {del.fileType === 'docx' ? <FileText className="w-4 h-4" /> :
                                           del.fileType === 'xlsx' ? <FileSpreadsheet className="w-4 h-4" /> :
                                           <Code2 className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="font-semibold text-white truncate">{del.fileName}</div>
                                          <div className="text-[10px] text-slate-400 font-mono truncate">{del.filePath}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(del.content, del.id || `del-${dIdx}`)}
                                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
                                          title="Copiar contenido"
                                        >
                                          {copiedId === (del.id || `del-${dIdx}`) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadDeliverable(del)}
                                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition flex items-center gap-1 shadow-sm cursor-pointer"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                          <span>Descargar</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Email Actions Card */}
                            {msg.emailActions && msg.emailActions.length > 0 && (
                              <div className="mt-3 p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-2">
                                <div className="text-[11px] font-semibold text-sky-400 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Acción de Outlook Preparada</span>
                                </div>
                                {msg.emailActions.map((act, aIdx) => (
                                  <div key={aIdx} className="text-xs space-y-1">
                                    <div className="text-slate-300"><span className="text-slate-500">Destinatario:</span> {act.recipient || 'a01425929@tec.mx'}</div>
                                    <div className="text-slate-300 font-semibold">{act.subject}</div>
                                    {act.draftReply && (
                                      <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 italic">
                                        "{act.draftReply}"
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Bottom Card Actions: Speak, Copy, Next orders */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSpeak(msg.content, msg.id)}
                                  className={`px-2 py-1 rounded-lg text-[11px] transition flex items-center gap-1 cursor-pointer ${
                                    isSpeaking
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                  }`}
                                  title="Escuchar respuesta con voz"
                                >
                                  {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
                                  <span>{isSpeaking ? 'Detener voz' : 'Escuchar'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCopy(msg.content, msg.id)}
                                  className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] transition flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === msg.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copiar texto</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {msg.suggestedNextOrders && msg.suggestedNextOrders.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.suggestedNextOrders.map((sug, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => onSendMessage(sug)}
                                      className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/80 text-[11px] text-indigo-300 hover:text-white transition cursor-pointer"
                                    >
                                      → {sug}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading Indicator inside Chat */}
            {isLoading && (
              <div className="flex gap-3 max-w-2xl mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curto's AI está razonando, analizando los archivos y formulando la respuesta...</span>
                  </div>
                  <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form & Attached Files Tray */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 space-y-2.5 shrink-0">
            {/* Cognitive Engine Selection Bar & Fast Suggestions */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                <span className="text-[11px] text-slate-500 font-medium">Modo:</span>
                <button
                  type="button"
                  onClick={() => setSelectedEngine('deep_research')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedEngine === 'deep_research'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Deep Reasoning</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEngine('devin_code')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedEngine === 'devin_code'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <Code2 className="w-3 h-3 text-purple-400" />
                  <span>Devin Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEngine('doc_factory')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 cursor-pointer ${
                    selectedEngine === 'doc_factory'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                  <span>Fábrica .docx/.xlsx</span>
                </button>
              </div>

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('benchmark')}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🏆 Benchmark #1 Global</span>
                </button>
              )}
            </div>

            {/* Attached Files Preview Tray (Above Textarea) */}
            {attachments.length > 0 && (
              <div className="p-2 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between px-1 text-[11px]">
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Paperclip className="w-3 h-3" />
                    <span>{attachments.length} archivo(s) listo(s) para enviar:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachments([])}
                    className="text-slate-400 hover:text-rose-400 transition text-[10px] cursor-pointer"
                  >
                    Quitar todos
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-thin p-1">
                  {attachments.map(att => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-950 border border-slate-800 text-xs shadow-sm group hover:border-cyan-500/40 transition"
                    >
                      {att.isImage && att.content && att.content.startsWith('data:') ? (
                        <img
                          src={att.content}
                          alt={att.name}
                          onClick={() => setPreviewAttachment(att)}
                          className="w-6 h-6 rounded object-cover cursor-pointer hover:opacity-80 transition shrink-0"
                        />
                      ) : (
                        <div className="p-1 rounded bg-slate-900 text-slate-400 shrink-0">
                          {getCategoryIcon(att.category)}
                        </div>
                      )}
                      
                      <div className="min-w-0 max-w-[140px]">
                        <div className="font-medium text-slate-200 truncate text-[11px]">{att.name}</div>
                        <div className="text-[9px] font-mono text-slate-500">{formatFileSize(att.size)}</div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(att)}
                          className="p-1 text-slate-400 hover:text-cyan-300 rounded transition cursor-pointer"
                          title="Previsualizar"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded transition cursor-pointer"
                          title="Quitar archivo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form with Attachment & Voice Controls */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-end bg-slate-900/90 border-2 border-indigo-500/30 focus-within:border-cyan-400 rounded-2xl p-2 shadow-inner transition-all">
                {/* File Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="p-2 mr-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition shrink-0 cursor-pointer disabled:opacity-40"
                  title="Adjuntar todo tipo de archivos (PDF, Excel, Código, Imágenes, Audio, Documentos)"
                >
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  rows={2}
                  placeholder={
                    attachments.length > 0
                      ? "¿Qué deseas que haga Curto's AI con los archivos adjuntos? (O presiona Enviar para análisis automático)..."
                      : "Pregúntale lo que quieras o arrastra archivos aquí (código, documentos, hojas de cálculo, imágenes)..."
                  }
                  className="w-full bg-transparent px-2 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none resize-none max-h-32 leading-relaxed"
                />

                <div className="flex items-center gap-1 shrink-0 pb-1">
                  {/* Voice dictation button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-rose-400'
                    }`}
                    title={isListening ? "Detener dictado por voz" : "Hablar por micrófono (dictado por voz)"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={isLoading || (!inputText.trim() && attachments.length === 0)}
                    className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold shadow-md shadow-indigo-500/20 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Enviar pregunta u orden (Enter)"
                  >
                    <Send className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick helper footer */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1 gap-1">
              <span className="flex items-center gap-1.5">
                <span>📎 Arrastra cualquier archivo o pega imágenes con <strong>Ctrl+V</strong></span>
              </span>
              <span className="font-mono text-cyan-400/80">Historial seguro guardado localmente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewAttachment(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {getCategoryIcon(previewAttachment.category)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{previewAttachment.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {formatFileSize(previewAttachment.size)} • {previewAttachment.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadAttachment(previewAttachment)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950/50">
              {previewAttachment.isImage && previewAttachment.content && previewAttachment.content.startsWith('data:') ? (
                <img
                  src={previewAttachment.content}
                  alt={previewAttachment.name}
                  className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-lg border border-slate-800"
                />
              ) : previewAttachment.content && !previewAttachment.content.startsWith('data:') ? (
                <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-200 overflow-x-auto max-h-[60vh] leading-relaxed">
                  <pre>{previewAttachment.content.slice(0, 15000)}</pre>
                  {previewAttachment.content.length > 15000 && (
                    <div className="mt-2 text-slate-500 italic">
                      [Vista previa truncada a los primeros 15,000 caracteres...]
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    {getCategoryIcon(previewAttachment.category)}
                  </div>
                  <h5 className="font-semibold text-white">Archivo binario indexado</h5>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Este formato binario ({previewAttachment.type}) está listo y codificado para el motor multimodal de Curto's AI. Puedes descargarlo o pedirle que lo procese.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
