import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Star, 
  Trash2, 
  Archive, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  Clock, 
  User, 
  Bot, 
  RefreshCw,
  FolderKanban,
  Check,
  Edit3,
  SlidersHorizontal,
  FileText,
  Settings,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  Email, 
  EmailTemplate, 
  EmailClassificationRule, 
  EmailAccountConfig 
} from '../types/agent';

interface EmailManagerProps {
  emails: Email[];
  templates: EmailTemplate[];
  rules: EmailClassificationRule[];
  accountConfig: EmailAccountConfig;
  onUpdateEmails: (emails: Email[]) => void;
  onUpdateTemplates: (templates: EmailTemplate[]) => void;
  onUpdateRules: (rules: EmailClassificationRule[]) => void;
  onUpdateAccountConfig: (config: EmailAccountConfig) => void;
  onConvertEmailToProject?: (email: Email) => void;
  onDispatchOrder: (order: string) => void;
}

export const EmailManager: React.FC<EmailManagerProps> = ({
  emails,
  templates,
  rules,
  accountConfig,
  onUpdateEmails,
  onUpdateTemplates,
  onUpdateRules,
  onUpdateAccountConfig,
  onConvertEmailToProject,
  onDispatchOrder
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'project' | 'financial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'inbox' | 'templates' | 'rules' | 'integration'>('inbox');
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [customUserInstruction, setCustomUserInstruction] = useState('');
  const [isDraftingTemplate, setIsDraftingTemplate] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analysisReport, setAnalysisReport] = useState<{
    overallSummary: string;
    urgentCount: number;
    actionItems: string[];
  } | null>(null);

  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [replySuccessMessage, setReplySuccessMessage] = useState(false);

  // New Rule Modal
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCondition, setNewRuleCondition] = useState<'sender_contains' | 'subject_contains'>('sender_contains');
  const [newRuleValue, setNewRuleValue] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'urgente' | 'cliente' | 'factura' | 'proyecto' | 'trabajo'>('urgente');

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  // Filtering
  const filteredEmails = emails.filter(email => {
    const matchesSearch = 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'unread') return !email.read;
    if (filter === 'urgent') return email.priority === 'alta' || email.category === 'urgente';
    if (filter === 'project') return email.category === 'proyecto' || email.category === 'trabajo';
    if (filter === 'financial') return email.category === 'factura';
    return true;
  });

  const handleSelectEmail = (email: Email) => {
    setSelectedEmailId(email.id);
    setDraftContent(email.draftReply || '');
    setIsEditingDraft(false);
    if (!email.read) {
      const updated = emails.map(e => e.id === email.id ? { ...e, read: true } : e);
      onUpdateEmails(updated);
    }
  };

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    );
    onUpdateEmails(updated);
  };

  const handleSendReply = () => {
    if (!selectedEmail) return;
    const updated = emails.map(e => 
      e.id === selectedEmail.id 
        ? { ...e, replySent: true, draftReply: draftContent || e.draftReply } 
        : e
    );
    onUpdateEmails(updated);
    setReplySuccessMessage(true);
    setTimeout(() => setReplySuccessMessage(false), 3000);
  };

  // Draft a response using the selected template or custom user instructions
  const handleDraftFromTemplate = async () => {
    if (!selectedEmail) return;
    setIsDraftingTemplate(true);

    const chosenTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

    try {
      const res = await fetch('/api/agent/draft-template-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          template: chosenTemplate,
          customInstruction: customUserInstruction
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDraftContent(data.draftReply);
        setIsEditingDraft(true);

        const updated = emails.map(e => 
          e.id === selectedEmail.id 
            ? { ...e, draftReply: data.draftReply, usedTemplateId: chosenTemplate.id } 
            : e
        );
        onUpdateEmails(updated);
      }
    } catch (err) {
      console.error('Error drafting with template:', err);
    } finally {
      setIsDraftingTemplate(false);
    }
  };

  // Run Global Triage with AI
  const handleRunGlobalTriage = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/agent/analyze-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisReport({
          overallSummary: data.overallSummary || 'Análisis completado.',
          urgentCount: data.urgentCount || 0,
          actionItems: data.actionItems || []
        });

        // Update emails with suggested drafts and categories
        if (data.processedEmails && Array.isArray(data.processedEmails)) {
          const updated = emails.map(e => {
            const match = data.processedEmails.find((pe: any) => pe.id === e.id);
            if (match) {
              return {
                ...e,
                priority: match.urgency || e.priority,
                draftReply: match.draftReply || e.draftReply
              };
            }
            return e;
          });
          onUpdateEmails(updated);
        }
      }
    } catch (err) {
      console.error('Error running triage:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleValue.trim()) return;

    const newRule: EmailClassificationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      conditionType: newRuleCondition,
      value: newRuleValue.trim(),
      assignedCategory: newRuleCategory,
      assignedTemplateId: selectedTemplateId,
      autoDraftReply: true
    };

    onUpdateRules([...rules, newRule]);
    setNewRuleName('');
    setNewRuleValue('');
    setShowAddRule(false);
  };

  // Handle Microsoft OAuth Popup
  const handleConnectOutlookOAuth = async () => {
    try {
      const res = await fetch('/api/auth/outlook/url');
      if (res.ok) {
        const data = await res.json();
        const popup = window.open(
          data.url,
          'microsoft_oauth_popup',
          'width=600,height=700,scrollbars=yes'
        );
        if (!popup) {
          alert('Por favor habilita las ventanas emergentes en tu navegador para conectar Microsoft Outlook.');
        }
      }
    } catch (err) {
      console.error('Error opening Outlook OAuth:', err);
    }
  };

  // Sync Outlook mailbox
  const [isSyncingOutlook, setIsSyncingOutlook] = useState(false);
  const handleSyncOutlook = async () => {
    setIsSyncingOutlook(true);
    try {
      const res = await fetch('/api/outlook/sync', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountEmail: accountConfig.accountEmail || 'a01425929@tec.mx' })
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateAccountConfig({
          provider: 'outlook',
          accountEmail: data.account || 'a01425929@tec.mx',
          userName: 'Matrícula a01425929 • Tecnológico de Monterrey',
          connected: true,
          lastSync: 'Hoy, ' + new Date().toLocaleTimeString()
        });
      }
    } catch (err) {
      console.error('Error syncing Outlook:', err);
    } finally {
      setTimeout(() => setIsSyncingOutlook(false), 800);
    }
  };

  // Listen for OAuth success message from popup
  React.useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'outlook') {
        onUpdateAccountConfig({
          provider: 'outlook',
          accountEmail: event.data.email || 'a01425929@tec.mx',
          userName: 'Matrícula a01425929 • Tecnológico de Monterrey',
          connected: true,
          lastSync: 'Hoy, ' + new Date().toLocaleTimeString()
        });
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Account Status */}
      <div className={`border rounded-2xl p-5 shadow-xl transition-all ${
        accountConfig.provider === 'outlook'
          ? 'bg-gradient-to-r from-slate-900 via-sky-950/50 to-slate-900 border-sky-800/60'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`p-2 rounded-xl border ${
                accountConfig.provider === 'outlook'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <Mail className="w-5 h-5" />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {accountConfig.provider === 'outlook' 
                    ? `Buzón Outlook: ${accountConfig.accountEmail}` 
                    : 'Integración de Correo Electrónico (Gmail & Outlook)'}
                </h2>
                {accountConfig.accountEmail.includes('tec.mx') && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Tecnológico de Monterrey (tec.mx)
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {accountConfig.provider === 'outlook'
                ? `Buzón institucional conectado mediante Microsoft Graph API a ${accountConfig.accountEmail}. Lectura, clasificación automática y envío de correos.`
                : 'Lectura y clasificación por remitente y asunto, con redacción de respuestas basadas en plantillas e instrucciones personalizadas.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Account Switcher Buttons */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  handleSyncOutlook();
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  accountConfig.provider === 'outlook'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-300" />
                <span>Outlook ({accountConfig.accountEmail.split('@')[0]})</span>
              </button>

              <button
                onClick={() => {
                  onUpdateAccountConfig({
                    provider: 'gmail',
                    accountEmail: 'curtoasturias@gmail.com',
                    userName: 'Curto Asturias (Gmail)',
                    connected: true,
                    lastSync: 'Hoy, ' + new Date().toLocaleTimeString()
                  });
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  accountConfig.provider === 'gmail'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-300" />
                <span>Gmail</span>
              </button>
            </div>

            {/* Sync Button */}
            {accountConfig.provider === 'outlook' && (
              <button
                onClick={handleSyncOutlook}
                disabled={isSyncingOutlook}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold border border-sky-800/60 transition disabled:opacity-50"
                title="Sincronizar mensajes de Outlook"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOutlook ? 'animate-spin' : ''}`} />
                <span>{isSyncingOutlook ? 'Sincronizando...' : 'Sincronizar Outlook'}</span>
              </button>
            )}

            <button
              onClick={handleRunGlobalTriage}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analizando...' : 'Triaje Total IA'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setViewMode('inbox')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === 'inbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Bandeja de Entrada ({emails.length})</span>
          </button>

          <button
            onClick={() => setViewMode('templates')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === 'templates'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Biblioteca de Plantillas ({templates.length})</span>
          </button>

          <button
            onClick={() => setViewMode('rules')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === 'rules'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Reglas de Clasificación ({rules.length})</span>
          </button>

          <button
            onClick={() => setViewMode('integration')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              viewMode === 'integration'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración Gmail / Outlook</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: BANDEJA DE ENTRADA Y LECTURA */}
      {viewMode === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden min-h-[640px]">
          {/* Left Column: Email List (5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col">
            <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/30">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por remitente, asunto o texto..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Quick Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Todos ({emails.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  No leídos ({emails.filter(e => !e.read).length})
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === 'urgent' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Urgentes ({emails.filter(e => e.priority === 'alta').length})
                </button>
                <button
                  onClick={() => setFilter('project')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === 'project' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Proyectos
                </button>
                <button
                  onClick={() => setFilter('financial')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    filter === 'financial' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Facturas
                </button>
              </div>
            </div>

            {/* Email list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[580px]">
              {filteredEmails.map(email => (
                <div
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={`p-4 cursor-pointer transition relative group ${
                    selectedEmailId === email.id
                      ? 'bg-indigo-950/30 border-l-4 border-indigo-500'
                      : 'hover:bg-slate-900/40'
                  } ${!email.read ? 'bg-slate-900/20 font-medium' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {!email.read && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />}
                      <span className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {email.sender}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 shrink-0">
                      <span>{email.date}</span>
                      <button onClick={e => handleToggleStar(e, email.id)}>
                        <Star className={`w-3.5 h-3.5 ${email.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-medium text-slate-200 mt-1 line-clamp-1">
                    {email.subject}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {email.snippet}
                  </p>

                  <div className="flex items-center gap-2 mt-2.5">
                    {email.priority === 'alta' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Urgente
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {email.category}
                    </span>
                    {email.replySent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Respondido
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Email Detail & Template-Based Responder (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-slate-900/20">
            {selectedEmail ? (
              <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                {/* Header */}
                <div className="border-b border-slate-800 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-slate-300">{selectedEmail.sender}</span>
                        <span>&lt;{selectedEmail.senderEmail}&gt;</span>
                        <span>•</span>
                        <span>{selectedEmail.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedEmail.priority === 'alta' && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Urgente
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="prose prose-invert prose-xs text-slate-200 text-xs leading-relaxed whitespace-pre-line bg-slate-950/50 p-5 rounded-xl border border-slate-800">
                  {selectedEmail.body}
                </div>

                {/* Template-Based Response Engine Box */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Redactor Inteligente con Plantillas & Instrucciones
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Adaptación contextual mediante Gemini
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Selecciona Plantilla Base:
                      </label>
                      <select
                        value={selectedTemplateId}
                        onChange={e => setSelectedTemplateId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {templates.map(tpl => (
                          <option key={tpl.id} value={tpl.id}>
                            {tpl.name} ({tpl.tone})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Instrucción Específica Adicional (Opcional):
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Confirmar reunión para el jueves a las 11:30..."
                        value={customUserInstruction}
                        onChange={e => setCustomUserInstruction(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleDraftFromTemplate}
                      disabled={isDraftingTemplate}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
                    >
                      <Bot className={`w-3.5 h-3.5 ${isDraftingTemplate ? 'animate-spin' : ''}`} />
                      <span>{isDraftingTemplate ? 'Generando Borrador...' : 'Redactar Respuesta con Plantilla'}</span>
                    </button>
                  </div>
                </div>

                {/* Draft Review & Send */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Borrador Preparado para Envío:
                    </span>
                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingDraft ? 'Guardar Cambios' : 'Editar Borrador'}</span>
                    </button>
                  </div>

                  {isEditingDraft ? (
                    <textarea
                      rows={6}
                      value={draftContent || selectedEmail.draftReply || ''}
                      onChange={e => setDraftContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {draftContent || selectedEmail.draftReply || 'Selecciona una plantilla y pulsa "Redactar Respuesta con Plantilla" para generar el borrador.'}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-slate-500">
                      {selectedEmail.replySent ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Respuesta enviada al remitente.
                        </span>
                      ) : (
                        <span>Listo para despachar.</span>
                      )}
                    </div>

                    <button
                      onClick={handleSendReply}
                      disabled={selectedEmail.replySent}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{selectedEmail.replySent ? 'Enviado' : 'Aprobar y Enviar Respuesta'}</span>
                    </button>
                  </div>

                  {replySuccessMessage && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center animate-fade-in">
                      ✓ Respuesta enviada con éxito mediante la cuenta {accountConfig.provider.toUpperCase()}.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Selecciona un correo para leerlo y gestionar acciones.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: BIBLIOTECA DE PLANTILLAS */}
      {viewMode === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Plantillas Oficiales de Respuesta
              </h3>
              <p className="text-xs text-slate-400">
                El agente utiliza estas plantillas para mantener coherencia en presupuestos, soporte y gestión comercial.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tpl => (
              <div key={tpl.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Tono: {tpl.tone}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{tpl.description}</p>
                <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed border border-slate-800">
                  {tpl.templateText}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: REGLAS DE CLASIFICACIÓN */}
      {viewMode === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Reglas Heurísticas de Clasificación por Remitente y Asunto
              </h3>
              <p className="text-xs text-slate-400">
                Filtra y asigna automáticamente etiquetas de urgencia o plantillas a correos entrantes.
              </p>
            </div>

            <button
              onClick={() => setShowAddRule(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Regla</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map(rule => (
              <div key={rule.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                    Categoría: {rule.assignedCategory}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="text-slate-500">Condición:</span>
                  <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono text-[11px]">
                    {rule.conditionType === 'sender_contains' ? 'Remitente contiene' : 'Asunto contiene'} "{rule.value}"
                  </code>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                  <span>Auto-redactar borrador:</span>
                  <span className="text-emerald-400 font-medium">Sí</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Rule Modal */}
          {showAddRule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Nueva Regla de Clasificación</h3>
                  <button onClick={() => setShowAddRule(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddRuleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Regla</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Correos de clientes VIP"
                      value={newRuleName}
                      onChange={e => setNewRuleName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tipo de Condición</label>
                    <select
                      value={newRuleCondition}
                      onChange={e => setNewRuleCondition(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="sender_contains">El remitente contiene...</option>
                      <option value="subject_contains">El asunto contiene...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Valor a buscar</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: @empresa.com o 'Factura'"
                      value={newRuleValue}
                      onChange={e => setNewRuleValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Categoría Asignada</label>
                    <select
                      value={newRuleCategory}
                      onChange={e => setNewRuleCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="urgente">Urgente</option>
                      <option value="cliente">Cliente</option>
                      <option value="factura">Factura</option>
                      <option value="proyecto">Proyecto</option>
                      <option value="trabajo">Trabajo</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRule(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Crear Regla
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 4: CONFIGURACIÓN DE CUENTA (GMAIL & OUTLOOK) */}
      {viewMode === 'integration' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Conexión de Cuentas de Correo
            </h3>
            <p className="text-xs text-slate-400">
              Conecta tu buzón de Gmail (Google Workspace) o Microsoft Outlook para sincronizar mensajes en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gmail Card */}
            <div className={`p-5 rounded-2xl border transition ${
              accountConfig.provider === 'gmail'
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Gmail / Google Workspace</h4>
                    <span className="text-xs text-slate-400 font-mono">curtoasturias@gmail.com</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Activo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Permite a OmniAgent leer la bandeja de entrada, detectar hilos no leídos y preparar borradores en tu cuenta.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">Última sincronización: Hoy, 09:30 AM</span>
                <button
                  onClick={() => onUpdateAccountConfig({ ...accountConfig, provider: 'gmail' })}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Seleccionar
                </button>
              </div>
            </div>

            {/* Outlook Card */}
            <div className={`p-5 rounded-2xl border transition ${
              accountConfig.provider === 'outlook'
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    O
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Microsoft Outlook / Office 365</h4>
                    <span className="text-xs text-slate-400 font-mono">outlook.office365.com</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                  Disponible
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Soporte para Microsoft Graph API y cuentas corporativas de Microsoft Exchange y Outlook personal.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">Sincronización bidireccional</span>
                <button
                  onClick={() => onUpdateAccountConfig({ ...accountConfig, provider: 'outlook', accountEmail: 'curto@outlook.com' })}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Conectar Outlook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
