import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Download, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FolderKanban,
  Mail,
  Cpu,
  Sparkles
} from 'lucide-react';
import { SUPER_AUTOPILOT_CHAINS } from '../data/initialData';
import { SuperAutopilotChain, ProjectDeliverable } from '../types/agent';

interface SuperAutopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteChain: (chain: SuperAutopilotChain) => Promise<void>;
  isLoading: boolean;
  activeChainProgress?: {
    chainId: string;
    currentStepIndex: number;
    stepsDone: string[];
    isCompleted: boolean;
    generatedDeliverables: ProjectDeliverable[];
  };
}

export const SuperAutopilotModal: React.FC<SuperAutopilotModalProps> = ({
  isOpen,
  onClose,
  onExecuteChain,
  isLoading,
  activeChainProgress
}) => {
  const [selectedChainId, setSelectedChainId] = useState<string>(SUPER_AUTOPILOT_CHAINS[0].id);

  if (!isOpen) return null;

  const selectedChain = SUPER_AUTOPILOT_CHAINS.find(c => c.id === selectedChainId) || SUPER_AUTOPILOT_CHAINS[0];

  const handleDownload = (del: ProjectDeliverable) => {
    const blob = new Blob([del.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = del.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Curto's Multi-Agent Autopilot • Cadenas Autónomas de 1-Clic</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Orquestación de Agentes Compuestos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A diferencia de ChatGPT que requiere 15 preguntas y respuestas manuales, Curto's AI encadena múltiples roles especializados en paralelo y te entrega los archivos terminados.
          </p>
        </div>

        {/* Chain Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SUPER_AUTOPILOT_CHAINS.map(chain => {
            const isSelected = selectedChainId === chain.id;
            return (
              <button
                key={chain.id}
                onClick={() => setSelectedChainId(chain.id)}
                className={`p-3.5 rounded-2xl text-left transition border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block mb-1">
                    {chain.category}
                  </span>
                  <div className="font-bold text-xs text-white line-clamp-1">{chain.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{chain.subtitle}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{chain.stepsCount} Pasos</span>
                  <span className="text-cyan-300 font-mono">{chain.estimatedSeconds}s</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chain Detailed Pipeline */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{selectedChain.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedChain.description}</p>
            </div>

            <button
              onClick={() => onExecuteChain(selectedChain)}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Play className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Ejecutando Cadena...' : 'Lanzar Cadena Autónoma'}</span>
            </button>
          </div>

          {/* Target Folders and Outputs Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-500">Destino:</span>
            {selectedChain.targetFolders.map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 font-mono text-[11px]">
                /{f}
              </span>
            ))}
            <span className="text-slate-500 ml-2">Archivos resultantes:</span>
            {selectedChain.outputFiles.map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50 font-mono text-[11px]">
                {f}
              </span>
            ))}
          </div>

          {/* Visual Step-by-Step Pipeline */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-300">Etapas de Ejecución Orquestada:</div>
            <div className="space-y-2">
              {selectedChain.pipeline.map((step, idx) => {
                const isCurrentActive = activeChainProgress?.chainId === selectedChain.id && activeChainProgress.currentStepIndex === idx && !activeChainProgress.isCompleted;
                const isPastDone = activeChainProgress?.chainId === selectedChain.id && (activeChainProgress.currentStepIndex > idx || activeChainProgress.isCompleted);

                return (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition ${
                      isCurrentActive
                        ? 'bg-indigo-950/60 border-cyan-400 text-white animate-pulse'
                        : isPastDone
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-slate-300 shrink-0">
                      {isPastDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{step.step}</span>
                        <span className="px-2 py-0.2 rounded-full bg-indigo-900/50 text-indigo-300 text-[10px] font-mono border border-indigo-700/40">
                          {step.agentRole}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{step.actionDetail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Deliverables if completed */}
          {activeChainProgress?.isCompleted && activeChainProgress.generatedDeliverables.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Cadena Autónoma Completada con Éxito! Entregables Listos:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeChainProgress.generatedDeliverables.map(del => (
                  <div key={del.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">{del.fileName}</div>
                        <div className="text-[10px] text-slate-400">{del.filePath}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(del)}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0 ml-2"
                      title="Descargar archivo a tu ordenador"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
