import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Mail, 
  Zap, 
  Cpu, 
  Trophy, 
  Code2, 
  FileSpreadsheet, 
  FileText,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { 
  AgentExecution, 
  ProjectDeliverable, 
  LocalBridgeStatus, 
  Project, 
  PendingTask, 
  ConversationSession, 
  CognitiveEngineMode,
  ChatAttachment
} from '../types/agent';
import { SystemMetricsDashboard } from './SystemMetricsDashboard';
import { ConversationChatStudio } from './ConversationChatStudio';

interface ControlCenterProps {
  onDispatchOrder: (prompt: string, engineMode?: CognitiveEngineMode, attachments?: ChatAttachment[]) => Promise<void>;
  isLoading: boolean;
  executions: AgentExecution[];
  conversations: ConversationSession[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onCreateNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  bridgeStatus: LocalBridgeStatus;
  onOpenBridgeModal: () => void;
  onNavigateToTab: (tab: 'control' | 'email' | 'tasks' | 'projects' | 'computer' | 'security' | 'benchmark' | 'sandbox') => void;
  projects?: Project[];
  pendingTasks?: PendingTask[];
  onOpenVoiceModal?: () => void;
  onOpenAutopilotModal?: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  onDispatchOrder,
  isLoading,
  executions,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateNewConversation,
  onDeleteConversation,
  onRenameConversation,
  bridgeStatus,
  onOpenBridgeModal,
  onNavigateToTab,
  projects = [],
  pendingTasks = [],
  onOpenVoiceModal,
  onOpenAutopilotModal
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'metrics' | 'actions'>('chat');

  return (
    <div className="space-y-4">
      {/* Sleek Top Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 sm:p-2.5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'chat'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Inteligente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('metrics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'metrics'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Métricas del Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('actions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'actions'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Acciones Rápidas</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-400 px-2">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Curto's AI en línea</span>
          </span>
          <span className="hidden md:inline text-slate-600">·</span>
          <span className="hidden md:inline font-mono text-[11px] text-blue-300">
            Outlook: a01425929@tec.mx
          </span>
        </div>
      </div>

      {/* 1. Primary View: Chat Inteligente */}
      {activeView === 'chat' && (
        <ConversationChatStudio
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onCreateNewConversation={onCreateNewConversation}
          onDeleteConversation={onDeleteConversation}
          onRenameConversation={onRenameConversation}
          onSendMessage={onDispatchOrder}
          isLoading={isLoading}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* 2. System Metrics & Telemetry Dashboard */}
      {activeView === 'metrics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Telemetría de Hardware & Rendimiento Semanal</h3>
              <p className="text-slate-400 text-xs mt-0.5">Monitoreo en tiempo real con Recharts de carga de CPU, memoria y proyectos entregados.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('chat')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-medium transition cursor-pointer"
            >
              Volver al Chat
            </button>
          </div>

          <SystemMetricsDashboard
            bridgeStatus={bridgeStatus}
            projects={projects}
            pendingTasks={pendingTasks}
            onNavigateToTab={onNavigateToTab as any}
          />
        </div>
      )}

      {/* 3. Quick Actions View */}
      {activeView === 'actions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outlook Sync Action */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-blue-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Revisar Correos de Outlook</h4>
                  <p className="text-xs text-slate-400">Cuenta: a01425929@tec.mx</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sincroniza la bandeja de entrada, detecta urgencias del Prof. Roberto Garza y prepara borradores de respuesta inmediatos.
              </p>
              <button
                type="button"
                onClick={async () => {
                  setActiveView('chat');
                  await onDispatchOrder('Sincroniza mi cuenta de Outlook a01425929@tec.mx, revisa correos urgentes y redacta las respuestas necesarias');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Ejecutar Revisión de Correos
              </button>
            </div>

            {/* Document Factory Action */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Generar Informe .docx</h4>
                  <p className="text-xs text-slate-400">Fábrica de documentos ejecutivos</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crea un documento profesional en formato Word (.docx) descargable con resumen, estructura y objetivos.
              </p>
              <button
                type="button"
                onClick={async () => {
                  setActiveView('chat');
                  await onDispatchOrder('Genera un informe técnico formal en .docx en /Documentos con análisis y conclusiones');
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Crear Documento .docx
              </button>
            </div>

            {/* Devin Code Sandbox Action */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-purple-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Sandbox de Código (Devin)</h4>
                  <p className="text-xs text-slate-400">Auto-reparación y REPL en vivo</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ejecuta scripts en Python, TypeScript o SQL con detección de bugs y auto-reparación instantánea.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('sandbox')}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Abrir Devin Sandbox
              </button>
            </div>

            {/* Benchmark Top Action */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-amber-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Benchmark vs ChatGPT & Claude</h4>
                  <p className="text-xs text-slate-400">Comparativa oficial de capacidades</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Descubre por qué Curto's AI supera a otros modelos en acceso real a archivos locales, sincronización de correo y auto-reparación.
              </p>
              <button
                type="button"
                onClick={() => onNavigateToTab('benchmark')}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer"
              >
                Ver Comparativa Benchmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
