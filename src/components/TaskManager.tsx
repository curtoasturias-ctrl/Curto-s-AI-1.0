import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  FileCode, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Bot, 
  Download, 
  FileText,
  Filter
} from 'lucide-react';
import { PendingTask, ProjectDeliverable } from '../types/agent';

interface TaskManagerProps {
  tasks: PendingTask[];
  onUpdateTasks: (tasks: PendingTask[]) => void;
  onTaskResolvedDeliverable?: (deliverable: ProjectDeliverable) => void;
  onDispatchOrder: (order: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onUpdateTasks,
  onTaskResolvedDeliverable,
  onDispatchOrder
}) => {
  const [filter, setFilter] = useState<'all' | 'alta' | 'media' | 'baja' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'alta' | 'media' | 'baja'>('alta');
  const [newCategory, setNewCategory] = useState('General');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProcessingTaskId, setActiveProcessingTaskId] = useState<string | null>(null);

  // Sorting: High priority first, then Medium, then Low, then completed
  const priorityOrder = { alta: 1, media: 2, baja: 3 };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredTasks = sortedTasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'alta') return !task.completed && task.priority === 'alta';
    if (filter === 'media') return !task.completed && task.priority === 'media';
    if (filter === 'baja') return !task.completed && task.priority === 'baja';
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleToggleCompleted = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toLocaleTimeString() : undefined
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdateTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: PendingTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      category: newCategory,
      completed: false,
      createdAt: 'Hoy, ' + new Date().toLocaleTimeString().slice(0, 5)
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  // Process a single task autonomously with OmniAgent
  const handleProcessTaskWithAgent = async (task: PendingTask) => {
    setIsProcessing(true);
    setActiveProcessingTaskId(task.id);

    try {
      const res = await fetch('/api/agent/process-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });

      if (res.ok) {
        const data = await res.json();
        
        // If a deliverable was produced, report it
        if (data.deliverable && onTaskResolvedDeliverable) {
          onTaskResolvedDeliverable({
            id: `del-${Date.now()}`,
            fileName: data.deliverable.fileName,
            filePath: data.deliverable.filePath,
            fileType: data.deliverable.fileType || 'markdown',
            description: data.deliverable.description || 'Entregable de resolución de tarea',
            content: data.deliverable.content || '',
            timestamp: new Date().toLocaleTimeString()
          });
        }

        // Mark task as completed with output summary
        const updated = tasks.map(t => {
          if (t.id === task.id) {
            return {
              ...t,
              completed: true,
              completedAt: new Date().toLocaleTimeString(),
              agentExecutionResult: data.resolutionSummary,
              outputLog: data.terminalLog
            };
          }
          return t;
        });

        onUpdateTasks(updated);
      }
    } catch (err) {
      console.error('Error processing task:', err);
    } finally {
      setIsProcessing(false);
      setActiveProcessingTaskId(null);
    }
  };

  // Process the highest priority pending task
  const handleProcessNextHighestPriority = async () => {
    const nextTask = sortedTasks.find(t => !t.completed);
    if (!nextTask) return;
    await handleProcessTaskWithAgent(nextTask);
  };

  const getPriorityBadge = (priority: 'alta' | 'media' | 'baja') => {
    switch (priority) {
      case 'alta':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
            <ArrowUp className="w-3 h-3 text-rose-400" />
            <span>Prioridad Alta</span>
          </span>
        );
      case 'media':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
            <Minus className="w-3 h-3 text-amber-400" />
            <span>Prioridad Media</span>
          </span>
        );
      case 'baja':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
            <ArrowDown className="w-3 h-3 text-emerald-400" />
            <span>Prioridad Baja</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CheckSquare className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Gestor Inteligente de Tareas Pendientes
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Asigna niveles de prioridad (Alta, Media, Baja). OmniAgent procesa las tareas más urgentes primero y genera las soluciones de forma autónoma.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleProcessNextHighestPriority}
              disabled={isProcessing || tasks.filter(t => !t.completed).length === 0}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Procesando Tarea...' : 'Procesar Prioridad Más Alta'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Counters */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Progreso de Resolución</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}% ({completedCount}/{tasks.length})</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>{tasks.filter(t => !t.completed && t.priority === 'alta').length} Altas pendientes</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{tasks.filter(t => !t.completed && t.priority === 'media').length} Medias pendientes</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('alta')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'alta' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Prioridad Alta ({tasks.filter(t => !t.completed && t.priority === 'alta').length})
          </button>
          <button
            onClick={() => setFilter('media')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'media' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Prioridad Media ({tasks.filter(t => !t.completed && t.priority === 'media').length})
          </button>
          <button
            onClick={() => setFilter('baja')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'baja' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Prioridad Baja ({tasks.filter(t => !t.completed && t.priority === 'baja').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>

        <span className="text-xs text-slate-500 hidden md:inline">
          Ordenadas automáticamente por prioridad
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 border border-slate-800 rounded-2xl">
            No hay tareas en esta categoría de filtro.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isThisProcessing = activeProcessingTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left side: Checkbox + details */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <button
                    onClick={() => handleToggleCompleted(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </h4>
                      {getPriorityBadge(task.priority)}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Agent execution output log if processed */}
                    {task.agentExecutionResult && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300 space-y-1">
                        <div className="font-semibold flex items-center gap-1 text-emerald-400">
                          <Bot className="w-3.5 h-3.5" /> Resolución Autónoma de OmniAgent:
                        </div>
                        <p className="text-slate-300">{task.agentExecutionResult}</p>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                      <span>Creada: {task.createdAt}</span>
                      {task.completedAt && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Completada a las {task.completedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  {!task.completed && (
                    <button
                      onClick={() => handleProcessTaskWithAgent(task)}
                      disabled={isProcessing}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isThisProcessing ? 'animate-spin' : ''}`} />
                      <span>{isThisProcessing ? 'Resolviendo...' : 'Resolver con OmniAgent'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Eliminar tarea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Añadir Nueva Tarea Pendiente</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Preparar presentación en .pptx para el comité"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción o Instrucciones para el Agente
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles de lo que el agente debe investigar, escribir o ejecutar en el ordenador..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nivel de Prioridad *
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="alta">🔴 Alta (Urgente)</option>
                    <option value="media">🟡 Media (Estándar)</option>
                    <option value="baja">🟢 Baja (Flexible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    placeholder="General, Documentos, Sistema..."
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
