import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Terminal, 
  Mail, 
  FolderKanban, 
  CheckSquare, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  Trophy, 
  Code2, 
  Mic, 
  Zap, 
  ChevronDown,
  HardDrive
} from 'lucide-react';
import { LocalBridgeStatus } from '../types/agent';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'control' | 'email' | 'tasks' | 'projects' | 'computer' | 'security' | 'bridge' | 'benchmark' | 'sandbox';
  setActiveTab: (tab: 'control' | 'email' | 'tasks' | 'projects' | 'computer' | 'security' | 'bridge' | 'benchmark' | 'sandbox') => void;
  unreadEmailCount: number;
  pendingTasksCount: number;
  activeProjectsCount: number;
  bridgeStatus: LocalBridgeStatus;
  onOpenBridgeModal: () => void;
  currentUser: FirebaseUser | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  isFirestoreOnline: boolean;
  outlookEmail?: string;
  onOpenVoiceModal?: () => void;
  onOpenAutopilotModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadEmailCount,
  pendingTasksCount,
  bridgeStatus,
  onOpenBridgeModal,
  currentUser,
  onGoogleSignIn,
  onSignOut,
  outlookEmail = 'a01425929@tec.mx',
  onOpenVoiceModal,
  onOpenAutopilotModal
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreTabActive = ['tasks', 'projects', 'computer', 'security'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setActiveTab('control')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                    Curto's AI
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded font-medium">
                    v3.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  Superinteligencia Autónoma
                </div>
              </div>
            </button>
          </div>

          {/* Clean Main Navigation */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('control')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'control'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                activeTab === 'email'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Outlook</span>
              {unreadEmailCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Sandbox</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer hidden md:flex ${
                activeTab === 'benchmark'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Benchmark</span>
            </button>

            {/* Dropdown for More Tools */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isMoreTabActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span>Herramientas</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('tasks'); setIsToolsOpen(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Tareas Pendientes</span>
                    </span>
                    {pendingTasksCount > 0 && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                        {pendingTasksCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('projects'); setIsToolsOpen(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Estudio de Proyectos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('computer'); setIsToolsOpen(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Consola & Archivos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('security'); setIsToolsOpen(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Seguridad y Permisos</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  <button
                    type="button"
                    onClick={() => { onOpenBridgeModal(); setIsToolsOpen(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 text-slate-300 flex items-center justify-between text-[11px]"
                  >
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                      <span>Puente PC Local</span>
                    </span>
                    <span className="text-[10px] text-emerald-400">
                      {bridgeStatus.isConnected ? 'Conectado' : 'Listo'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-2">
            {onOpenVoiceModal && (
              <button
                type="button"
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-300 text-xs font-semibold transition cursor-pointer"
                title="Hablar por voz con Curto's AI"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Voz</span>
              </button>
            )}

            {onOpenAutopilotModal && (
              <button
                type="button"
                onClick={onOpenAutopilotModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 text-xs font-semibold transition cursor-pointer"
                title="Cadenas Autopilot Autónomas"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Autopilot</span>
              </button>
            )}

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User"
                    className="w-7 h-7 rounded-full border border-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer"
                title="Iniciar sesión para guardar en la nube"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
