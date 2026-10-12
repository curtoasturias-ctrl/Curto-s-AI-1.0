import React, { useState } from 'react';
import { 
  Laptop, 
  Terminal, 
  Download, 
  Check, 
  Copy, 
  ShieldCheck, 
  RefreshCw, 
  X, 
  ExternalLink,
  Cpu,
  FileCode,
  FolderOpen
} from 'lucide-react';
import { LocalBridgeStatus } from '../types/agent';

interface LocalBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridgeStatus: LocalBridgeStatus;
  onRefreshBridge: () => void;
}

export const LocalBridgeModal: React.FC<LocalBridgeModalProps> = ({
  isOpen,
  onClose,
  bridgeStatus,
  onRefreshBridge
}) => {
  const [copiedPython, setCopiedPython] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'python' | 'cmd') => {
    navigator.clipboard.writeText(text);
    if (type === 'python') {
      setCopiedPython(true);
      setTimeout(() => setCopiedPython(false), 2000);
    } else {
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2000);
    }
  };

  const commandSnippet = `curl -s "${window.location.origin}/api/bridge/download/python" -o omni_bridge.py && python3 omni_bridge.py`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Acceso Total a tu Ordenador Real
                {bridgeStatus.isConnected ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Conectado
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Modo Sandbox Web Activo
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Conecta tu máquina física (Windows, macOS o Linux) para que Curto's AI ejecute tareas locales.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Banner */}
          {bridgeStatus.isConnected ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enlace Seguro Establecido con Éxito</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block">Sistema Operativo:</span>
                    <span className="font-mono text-emerald-300 font-medium">{bridgeStatus.os} {bridgeStatus.release}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Usuario Local:</span>
                    <span className="font-mono text-emerald-300 font-medium">{bridgeStatus.user}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Equipo:</span>
                    <span className="font-mono text-emerald-300 font-medium">{bridgeStatus.node || 'localhost'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Último Ping:</span>
                    <span className="font-mono text-emerald-300 font-medium">{bridgeStatus.lastPing}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onRefreshBridge}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verificar</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Cómo habilitar el Acceso Total en tu Ordenador (30 Segundos)</span>
                </div>
                <button
                  onClick={onRefreshBridge}
                  disabled={bridgeStatus.checking}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${bridgeStatus.checking ? 'animate-spin' : ''}`} />
                  <span>Comprobar Conexión</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                Por seguridad del navegador, las páginas web no pueden tocar tu disco duro directamente sin un puente local autorizado por ti. Con este script ligero y de código abierto en Python o Node, Curto's AI podrá ejecutar comandos reales en tu consola, leer/crear archivos en tu ordenador y automatizar cualquier tarea.
              </p>
            </div>
          )}

          {/* Step by step instructions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider text-[11px] text-slate-400">
              Pasos para conectar tu máquina
            </h4>

            {/* Step 1 */}
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-2 flex-1">
                <div className="text-sm font-medium text-slate-200">
                  Descarga el script ligero de puente (Daemon)
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="/api/bridge/download/python"
                    download="omni_agent_bridge.py"
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar para Python (omni_agent_bridge.py)</span>
                  </a>
                  <a
                    href="/api/bridge/download/node"
                    download="omni_agent_bridge.mjs"
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar para Node.js (omni_agent_bridge.mjs)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-2 flex-1">
                <div className="text-sm font-medium text-slate-200">
                  Ejecútalo en tu terminal (CMD, PowerShell o Bash)
                </div>
                <p className="text-xs text-slate-400">
                  Abre tu terminal en la carpeta donde descargaste el archivo y escribe:
                </p>
                <div className="relative bg-slate-950 rounded-lg p-3 font-mono text-xs text-cyan-300 border border-slate-800 flex items-center justify-between">
                  <code>python3 omni_agent_bridge.py</code>
                  <button
                    onClick={() => copyToClipboard('python3 omni_agent_bridge.py', 'python')}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Copiar comando"
                  >
                    {copiedPython ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1 flex-1">
                <div className="text-sm font-medium text-slate-200">
                  ¡Listo! OmniAgent detectará la conexión automáticamente
                </div>
                <p className="text-xs text-slate-400">
                  El script levanta un servidor seguro local en <code className="text-cyan-400">http://localhost:49152</code> al que solo este agente tiene acceso. Si no deseas ejecutar el script ahora, no te preocupes: OmniAgent funciona al 100% en el entorno <strong>Sandbox Virtual</strong> integrado.
                </p>
              </div>
            </div>
          </div>

          {/* Quick One-Liner Command */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-slate-900 border border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
              <span>🚀 Comando rápido en una sola línea (Linux / macOS / WSL):</span>
              <button
                onClick={() => copyToClipboard(commandSnippet, 'cmd')}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? '¡Copiado!' : 'Copiar comando'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded bg-black/60 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
              {commandSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Control 100% bajo tu supervisión local. Puedes detenerlo en cualquier momento con Ctrl+C.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
          >
            Entendido, volver al Agente
          </button>
        </div>
      </div>
    </div>
  );
};
