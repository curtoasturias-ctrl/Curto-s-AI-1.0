import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Folder, 
  FileText, 
  Cpu, 
  HardDrive, 
  Play, 
  Trash2, 
  Download, 
  Plus, 
  RefreshCw, 
  Laptop, 
  ShieldCheck, 
  FileCode, 
  Activity,
  CornerDownLeft,
  X
} from 'lucide-react';
import { FileItem, SystemProcess, LocalBridgeStatus } from '../types/agent';
import { BridgeService } from '../services/bridgeService';

interface ComputerDeskProps {
  files: FileItem[];
  processes: SystemProcess[];
  bridgeStatus: LocalBridgeStatus;
  terminalHistory: Array<{ command: string; output: string; time: string; mode?: string }>;
  onExecuteCommand: (cmd: string) => void;
  onUpdateFiles: (files: FileItem[]) => void;
  onOpenBridgeModal: () => void;
}

export const ComputerDesk: React.FC<ComputerDeskProps> = ({
  files,
  processes,
  bridgeStatus,
  terminalHistory,
  onExecuteCommand,
  onUpdateFiles,
  onOpenBridgeModal
}) => {
  const [subTab, setSubTab] = useState<'terminal' | 'files' | 'processes'>('terminal');
  const [inputCommand, setInputCommand] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileEditContent, setFileEditContent] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/usuario');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    onExecuteCommand(inputCommand.trim());
    setInputCommand('');
  };

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file);
    setFileEditContent(file.content || '');
  };

  const handleSaveFileContent = () => {
    if (!selectedFile) return;
    const updated = files.map(f => 
      f.path === selectedFile.path ? { ...f, content: fileEditContent, size: fileEditContent.length } : f
    );
    onUpdateFiles(updated);
    setSelectedFile({ ...selectedFile, content: fileEditContent, size: fileEditContent.length });
  };

  const handleDownloadFile = (file: FileItem) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with System Telemetry & Mode Indicator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Laptop className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Control Total del Ordenador y Estación de Sistema
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Terminal en tiempo real, gestor de archivos, monitor de recursos y ejecución de scripts.
            </p>
          </div>

          {/* Quick Hardware Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2.5">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">CPU</span>
                <span className="text-xs font-mono font-bold text-white">4.2%</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2.5">
              <Activity className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">RAM</span>
                <span className="text-xs font-mono font-bold text-white">4.8 / 16 GB</span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2.5">
              <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">DISCO</span>
                <span className="text-xs font-mono font-bold text-white">142 / 512 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setSubTab('terminal')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              subTab === 'terminal'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal Interactiva</span>
          </button>

          <button
            onClick={() => setSubTab('files')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              subTab === 'files'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Explorador de Archivos</span>
          </button>

          <button
            onClick={() => setSubTab('processes')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              subTab === 'processes'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Procesos del Sistema ({processes.length})</span>
          </button>

          <div className="flex-1" />

          <button
            onClick={onOpenBridgeModal}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{bridgeStatus.isConnected ? 'PC Real Vinculado' : 'Configurar PC Real'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TERMINAL INTERACTIVA */}
      {subTab === 'terminal' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col h-[580px]">
          {/* Terminal Window Chrome */}
          <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-slate-400 text-[11px] ml-2 font-semibold">
                {bridgeStatus.isConnected 
                  ? `[BRIDGE ACTIVO] ${bridgeStatus.user}@${bridgeStatus.node || 'pc'}:~` 
                  : 'usuario@omniagent-sandbox:~ (Bash Shell v5.2)'}
              </span>
            </div>

            {/* Quick Command Pills */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={() => onExecuteCommand('ls -la')}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px]"
              >
                ls -la
              </button>
              <button
                onClick={() => onExecuteCommand('ps aux')}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px]"
              >
                ps aux
              </button>
              <button
                onClick={() => onExecuteCommand('df -h')}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px]"
              >
                df -h
              </button>
              <button
                onClick={() => onExecuteCommand('python3 scripts/limpieza_temporales.py')}
                className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 text-[10px]"
              >
                limpieza.py
              </button>
              <button
                onClick={() => onExecuteCommand('clear')}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px]"
              >
                clear
              </button>
            </div>
          </div>

          {/* Terminal Output Log Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/80 text-slate-200">
            <div className="text-slate-500 leading-relaxed text-[11px]">
              OmniAgent Command Engine - Acceso de Sistema Inicializado.
              <br />
              Escribe cualquier comando de sistema o utiliza el Centro de Control para dar órdenes complejas en lenguaje natural.
            </div>

            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <span className="text-emerald-400 font-bold">usuario@omniagent:~$</span>
                  <span className="font-semibold text-white">{item.command}</span>
                  <span className="text-[10px] text-slate-600 font-normal ml-auto">{item.time}</span>
                </div>
                {item.output && (
                  <pre className="text-slate-300 whitespace-pre-wrap pl-4 border-l-2 border-slate-800 text-[11px] leading-relaxed">
                    {item.output}
                  </pre>
                )}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Form */}
          <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
            <span className="text-emerald-400 font-bold pl-2">usuario@omniagent:~$</span>
            <input
              type="text"
              autoFocus
              placeholder="Escribe un comando (ej: ls, cat archivo, uptime, help)..."
              value={inputCommand}
              onChange={e => setInputCommand(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none text-xs font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1 transition"
            >
              <span>Ejecutar</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: EXPLORADOR DE ARCHIVOS */}
      {subTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 border border-slate-800 rounded-2xl p-6 min-h-[540px]">
          {/* File List / Directory browser (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300 font-bold">{currentDir}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {files.length} elementos
              </span>
            </div>

            <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
              {files.map((file, idx) => {
                const isSelected = selectedFile?.path === file.path;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectFile(file)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      {file.isDir ? (
                        <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span className="text-xs font-mono truncate">{file.name}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 shrink-0 font-mono">
                      <span>{file.size > 0 ? `${file.size} B` : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Editor & Content Viewer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            {selectedFile ? (
              <>
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/70 border-b border-slate-800">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold text-white truncate">
                      {selectedFile.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveFileContent}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => handleDownloadFile(selectedFile)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Descargar archivo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={fileEditContent}
                  onChange={e => setFileEditContent(e.target.value)}
                  className="flex-1 p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none resize-none min-h-[380px]"
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs p-8 text-center">
                Haz clic en cualquier archivo para ver su contenido o editarlo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROCESOS DEL SISTEMA */}
      {subTab === 'processes' && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Monitor de Procesos en Ejecución
            </h3>
            <span className="text-xs text-slate-400">
              Supervisión en tiempo real por OmniAgent
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">PID</th>
                  <th className="py-2.5 px-3">Proceso</th>
                  <th className="py-2.5 px-3">Usuario</th>
                  <th className="py-2.5 px-3">% CPU</th>
                  <th className="py-2.5 px-3">Memoria (MB)</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {processes.map(proc => (
                  <tr key={proc.pid} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-cyan-400 font-semibold">{proc.pid}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{proc.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{proc.user}</td>
                    <td className="py-2.5 px-3">{proc.cpu}%</td>
                    <td className="py-2.5 px-3">{proc.mem} MB</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {proc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
