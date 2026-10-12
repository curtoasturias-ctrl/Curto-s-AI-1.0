import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Code, 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  TrendingUp,
  FileCode,
  Layers,
  ChevronRight,
  Bot
} from 'lucide-react';
import { Project, ProjectDeliverable, ProjectTask } from '../types/agent';

interface ProjectStudioProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  onDispatchOrder: (order: string) => void;
}

export const ProjectStudio: React.FC<ProjectStudioProps> = ({
  projects,
  onUpdateProjects,
  onDispatchOrder
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeDeliverableId, setActiveDeliverableId] = useState<string>('');
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const currentDeliverable = 
    selectedProject?.deliverables.find(d => d.id === activeDeliverableId) || 
    selectedProject?.deliverables[0];

  const handleToggleTask = (taskId: string) => {
    if (!selectedProject) return;
    const updatedTasks = selectedProject.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / (updatedTasks.length || 1)) * 100);

    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, tasks: updatedTasks, progress } : p
    );
    onUpdateProjects(updatedProjects);
  };

  const copyDeliverable = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFileId(id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  const downloadDeliverable = (deliverable: ProjectDeliverable) => {
    const blob = new Blob([deliverable.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = deliverable.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectPrompt.trim()) return;
    onDispatchOrder(`Crea un proyecto completo con entregables de código, informes y tareas para: "${newProjectPrompt}"`);
    setNewProjectPrompt('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FolderKanban className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Estudio de Proyectos, Informes y Desarrollo
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              OmniAgent planifica proyectos, escribe código de producción, genera informes técnicos y supervisa entregables de inicio a fin.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Encargar Nuevo Trabajo a OmniAgent</span>
          </button>
        </div>
      </div>

      {/* Projects Grid Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => {
          const isSelected = selectedProject?.id === proj.id;
          return (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                if (proj.deliverables.length > 0) {
                  setActiveDeliverableId(proj.deliverables[0].id);
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {proj.category}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {proj.progress}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2 line-clamp-1">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {proj.tasks.filter(t => t.completed).length} / {proj.tasks.length} tareas
                </span>
                <span className="flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  {proj.deliverables.length} entregables
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Deep Dive */}
      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
          {/* Left Column: Tasks & Milestones (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">{selectedProject.category}</span>
              <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Tasks Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tareas & Hitos de Ejecución
                </h4>
                <span className="text-xs text-emerald-400 font-mono">
                  {selectedProject.tasks.filter(t => t.completed).length} de {selectedProject.tasks.length} completadas
                </span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {selectedProject.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <button className="mt-0.5 text-emerald-400 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                    <span className={`text-xs flex-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                      {task.text}
                    </span>
                    {task.priority === 'alta' && !task.completed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Alta
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables List Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Archivos y Entregables Generados ({selectedProject.deliverables.length})
              </h4>
              <div className="space-y-1.5">
                {selectedProject.deliverables.map(del => {
                  const isActive = currentDeliverable?.id === del.id;
                  return (
                    <button
                      key={del.id}
                      onClick={() => setActiveDeliverableId(del.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition border ${
                        isActive
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                          : 'bg-slate-900/30 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="font-mono text-xs font-medium truncate">{del.fileName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{del.fileType}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Deliverable Viewer (Code & Document Reader) (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden min-h-[460px]">
            {currentDeliverable ? (
              <>
                {/* File Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/70 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {currentDeliverable.fileName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentDeliverable.filePath}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyDeliverable(currentDeliverable.content, currentDeliverable.id)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="Copiar contenido"
                    >
                      {copiedFileId === currentDeliverable.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => downloadDeliverable(currentDeliverable)}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition"
                      title="Descargar archivo a tu ordenador"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>

                {/* File Content Preview */}
                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 bg-slate-950/90 leading-relaxed whitespace-pre-wrap selection:bg-indigo-600 selection:text-white max-h-[500px]">
                  {currentDeliverable.content}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs p-8 text-center">
                No hay entregables seleccionados para este proyecto.
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Project Prompt Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-white font-bold text-base">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Pedir Nuevo Trabajo o Proyecto a OmniAgent</span>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  ¿Qué trabajo o proyecto deseas que el agente desarrolle?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ej: Crea una API en FastAPI con autenticación JWT, tests automatizados y docker-compose. O escribe una propuesta comercial completa para un cliente de retail..."
                  value={newProjectPrompt}
                  onChange={e => setNewProjectPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                OmniAgent creará automáticamente la estructura del proyecto, los hitos ordenados, generará los archivos de código o informes y los dejará listos en tu sistema de archivos.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <Bot className="w-4 h-4" />
                  <span>Generar Proyecto Completo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
