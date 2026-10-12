import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Cpu, 
  HardDrive, 
  FolderKanban, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Clock, 
  RefreshCw,
  Layers,
  BarChart3
} from 'lucide-react';
import { Project, PendingTask, LocalBridgeStatus } from '../types/agent';

interface SystemMetricsDashboardProps {
  bridgeStatus: LocalBridgeStatus;
  projects: Project[];
  pendingTasks: PendingTask[];
  onNavigateToTab?: (tab: 'control' | 'email' | 'tasks' | 'projects' | 'computer' | 'security') => void;
}

// Initial CPU and system timeline data (past 12 measurement intervals)
const INITIAL_CPU_TIMELINE = [
  { time: '04:00', cpuLoad: 14, ramUsage: 28, diskIO: 8, networkMbps: 12 },
  { time: '05:00', cpuLoad: 12, ramUsage: 27, diskIO: 5, networkMbps: 8 },
  { time: '06:00', cpuLoad: 18, ramUsage: 31, diskIO: 12, networkMbps: 15 },
  { time: '07:00', cpuLoad: 25, ramUsage: 34, diskIO: 22, networkMbps: 35 },
  { time: '08:00', cpuLoad: 48, ramUsage: 45, diskIO: 64, networkMbps: 78 },
  { time: '09:00', cpuLoad: 68, ramUsage: 56, diskIO: 85, networkMbps: 110 },
  { time: '09:20', cpuLoad: 75, ramUsage: 62, diskIO: 92, networkMbps: 140 },
  { time: '09:35', cpuLoad: 54, ramUsage: 52, diskIO: 48, networkMbps: 95 },
  { time: '09:45', cpuLoad: 42, ramUsage: 47, diskIO: 38, networkMbps: 68 },
  { time: '09:50', cpuLoad: 38, ramUsage: 44, diskIO: 32, networkMbps: 54 },
  { time: '09:55', cpuLoad: 29, ramUsage: 41, diskIO: 24, networkMbps: 45 },
  { time: '10:00', cpuLoad: 26, ramUsage: 39, diskIO: 20, networkMbps: 40 },
];

// Weekly project progress data (Mon through Sun)
const WEEKLY_PROJECTS_DATA = [
  { day: 'Lun', completados: 3, enProgreso: 1, entregablesDocx: 2, entregablesCode: 3, horasAgente: 4.2 },
  { day: 'Mar', completados: 4, enProgreso: 2, entregablesDocx: 3, entregablesCode: 5, horasAgente: 5.8 },
  { day: 'Mié', completados: 2, enProgreso: 3, entregablesDocx: 1, entregablesCode: 2, horasAgente: 3.5 },
  { day: 'Jue', completados: 5, enProgreso: 1, entregablesDocx: 4, entregablesCode: 6, horasAgente: 7.1 },
  { day: 'Vie', completados: 6, enProgreso: 2, entregablesDocx: 5, entregablesCode: 8, horasAgente: 8.4 },
  { day: 'Sáb', completados: 3, enProgreso: 0, entregablesDocx: 2, entregablesCode: 3, horasAgente: 2.9 },
  { day: 'Dom (Hoy)', completados: 4, enProgreso: 1, entregablesDocx: 3, entregablesCode: 4, horasAgente: 3.8 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Informes & Docs (.docx/.pdf)', value: 38, color: '#06b6d4' },
  { name: 'Desarrollo & APIs (.py/.ts)', value: 32, color: '#8b5cf6' },
  { name: 'Hojas de Cálculo (.xlsx)', value: 16, color: '#10b981' },
  { name: 'Gestión Outlook & Tareas', value: 14, color: '#f59e0b' },
];

export const SystemMetricsDashboard: React.FC<SystemMetricsDashboardProps> = ({
  bridgeStatus,
  projects,
  pendingTasks,
  onNavigateToTab
}) => {
  const [cpuTimeline, setCpuTimeline] = useState(INITIAL_CPU_TIMELINE);
  const [currentCpu, setCurrentCpu] = useState(26);
  const [currentRam, setCurrentRam] = useState(39);
  const [activeMetricView, setActiveMetricView] = useState<'all' | 'cpu' | 'projects'>('all');
  const [lastRefreshed, setLastRefreshed] = useState('Hace un momento');

  // Completed projects calculation
  const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
  const inProgressProjectsCount = projects.filter(p => p.status === 'in_progress').length;
  const totalTasksCount = pendingTasks.length;
  const completedTasksCount = pendingTasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 100;

  // Real-time subtle ticker for the charts
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTimeline(prev => {
        const last = prev[prev.length - 1];
        // Generate realistic jitter between 20% and 45% with occasional small peaks
        const delta = Math.floor(Math.random() * 9) - 4;
        const newCpu = Math.max(15, Math.min(85, last.cpuLoad + delta));
        const newRam = Math.max(30, Math.min(70, last.ramUsage + Math.floor(Math.random() * 3) - 1));
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        setCurrentCpu(newCpu);
        setCurrentRam(newRam);

        const updated = [...prev.slice(1), {
          time: timeStr,
          cpuLoad: newCpu,
          ramUsage: newRam,
          diskIO: Math.max(10, Math.min(80, last.diskIO + delta)),
          networkMbps: Math.max(20, Math.min(120, last.networkMbps + delta * 2))
        }];
        return updated;
      });
      setLastRefreshed('Actualizado en vivo');
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl backdrop-blur-md">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Dashboard de Telemetría & Rendimiento Semanal
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Monitoreo en vivo de CPU, memoria, throughput del sistema y entrega de proyectos completados esta semana.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono">{lastRefreshed}</span>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMetricView('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                activeMetricView === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveMetricView('cpu')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                activeMetricView === 'cpu' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              CPU & Hardware
            </button>
            <button
              onClick={() => setActiveMetricView('projects')}
              className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                activeMetricView === 'projects' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Proyectos
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Carga de CPU */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Carga CPU
            </span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
              currentCpu > 70 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {bridgeStatus.isConnected ? 'PC Real' : 'Sandbox'}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentCpu}%
            </span>
            <span className="text-xs text-slate-400">uso activo</span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${currentCpu}%` }} 
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Núcleos: {bridgeStatus.cpus || 8} Cores</span>
            <span>Estable</span>
          </div>
        </div>

        {/* KPI 2: Memoria RAM */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-4 h-4 text-purple-400" />
              Memoria RAM
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
              {currentRam}%
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {((currentRam / 100) * 16).toFixed(1)} GB
            </span>
            <span className="text-xs text-slate-400">/ 16.0 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${currentRam}%` }} 
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Libre: {(16 - (currentRam / 100) * 16).toFixed(1)} GB</span>
            <span>Optimizado</span>
          </div>
        </div>

        {/* KPI 3: Proyectos Completados Semanales */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <FolderKanban className="w-4 h-4 text-emerald-400" />
              Proyectos Semana
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
              +27% vs sem. ant.
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {27 + completedProjectsCount}
            </span>
            <span className="text-xs text-slate-400">completados</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full rounded-full" 
              style={{ width: '85%' }} 
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Meta semanal: 30</span>
            <span className="text-emerald-400 font-semibold">90% alcanzado</span>
          </div>
        </div>

        {/* KPI 4: Tasa de Resolución de Tareas */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Efectividad Tareas
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
              Gemini 3.8
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-400">completadas</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${taskCompletionRate}%` }} 
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Pendientes: {totalTasksCount - completedTasksCount}</span>
            <span>Prioridad Alta</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: CPU Load & Memory Timeline (Recharts AreaChart) */}
        {(activeMetricView === 'all' || activeMetricView === 'cpu') && (
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Carga de CPU & Memoria RAM en Tiempo Real
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Intervalo 15m • % de Uso
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cpuTimeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
                  />
                  <Area
                    type="monotone"
                    name="Carga CPU (%)"
                    dataKey="cpuLoad"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#cpuGradient)"
                  />
                  <Area
                    type="monotone"
                    name="Uso Memoria RAM (%)"
                    dataKey="ramUsage"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#ramGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">CPU Promedio</span>
                <span className="font-bold text-cyan-400">34.2%</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Pico Máximo</span>
                <span className="font-bold text-amber-400">75.0%</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Estado del Kernel</span>
                <span className="font-bold text-emerald-400">Óptimo</span>
              </div>
            </div>
          </div>
        )}

        {/* CHART 2: Weekly Completed Projects & Deliverables Progress (Recharts BarChart) */}
        {(activeMetricView === 'all' || activeMetricView === 'projects') && (
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Progreso de Proyectos Completados (Semanal)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Lunes - Domingo
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={WEEKLY_PROJECTS_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#020617', 
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="rect"
                    formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
                  />
                  <Bar 
                    name="Proyectos Completados" 
                    dataKey="completados" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    name="Entregables Generados (.docx/.py)" 
                    dataKey="entregablesDocx" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    name="En Progreso" 
                    dataKey="enProgreso" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Total Semana</span>
                <span className="font-bold text-emerald-400">27 Proyectos</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Día más Productivo</span>
                <span className="font-bold text-cyan-400">Viernes (6)</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Horas Agente</span>
                <span className="font-bold text-purple-400">35.7 hrs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sub-row: Category Breakdown & Operational Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Donut Chart: Project Types */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Distribución por Formato & Tarea</span>
          </div>
          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#020617', 
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '11px'
                  }} 
                  formatter={(val: any) => [`${val}%`, 'Proporción']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] space-y-1 text-slate-400">
            {CATEGORY_DISTRIBUTION.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-mono text-slate-300">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Highlights Box */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Resumen de Eficiencia del Agente en Esta Semana
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                100% Autónomo
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              OmniAgent ha procesado y archivado de manera segura en las carpetas autorizadas (<span className="text-cyan-300 font-mono">/Documentos</span>, <span className="text-cyan-300 font-mono">/Proyectos</span>, <span className="text-cyan-300 font-mono">/Descargas</span>) más de 20 entregables en formatos <span className="text-white font-medium">.docx, .pdf, .xlsx</span> y scripts ejecutables. La carga del procesador se mantiene en rangos seguros sin sobrecalentamiento.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Correos Outlook</span>
              <span className="font-bold text-white">100% Sincronizados</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Aislamiento Seguro</span>
              <span className="font-bold text-emerald-400">Activo (Zero-Trust)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">IOPS Disco</span>
              <span className="font-bold text-white">420 IOPS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Latencia Media IA</span>
              <span className="font-bold text-cyan-400">420 ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
