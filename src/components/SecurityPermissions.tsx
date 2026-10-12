import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FolderLock, 
  FileCode, 
  Check, 
  X, 
  AlertTriangle, 
  Plus, 
  HardDrive, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  FileText,
  FileSpreadsheet,
  Presentation,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { SecurityPolicy, FolderPermission, FileTypePermission, SecurityAuditEntry } from '../types/agent';

interface SecurityPermissionsProps {
  securityPolicy: SecurityPolicy;
  onUpdatePolicy: (policy: SecurityPolicy) => void;
  onOpenBridgeModal: () => void;
}

export const SecurityPermissions: React.FC<SecurityPermissionsProps> = ({
  securityPolicy,
  onUpdatePolicy,
  onOpenBridgeModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'folders' | 'filetypes' | 'audit'>('folders');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderPath, setNewFolderPath] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);

  const toggleFolderPermission = (folderId: string, perm: 'canRead' | 'canWrite' | 'canExecute' | 'enabled') => {
    const updatedFolders = securityPolicy.allowedFolders.map(f => {
      if (f.id === folderId) {
        return { ...f, [perm]: !f[perm] };
      }
      return f;
    });

    onUpdatePolicy({
      ...securityPolicy,
      allowedFolders: updatedFolders
    });
  };

  const toggleFileTypePermission = (ext: string, perm: 'canRead' | 'canWrite') => {
    const updatedTypes = securityPolicy.allowedFileTypes.map(t => {
      if (t.extension === ext) {
        return { ...t, [perm]: !t[perm] };
      }
      return t;
    });

    onUpdatePolicy({
      ...securityPolicy,
      allowedFileTypes: updatedTypes
    });
  };

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !newFolderPath.trim()) return;

    const newFolder: FolderPermission = {
      id: `fld-${Date.now()}`,
      name: newFolderName.trim(),
      virtualPath: newFolderPath.trim(),
      realPathHint: newFolderPath.trim(),
      canRead: true,
      canWrite: true,
      canExecute: false,
      enabled: true,
      description: 'Carpeta personalizada autorizada por el usuario.'
    };

    onUpdatePolicy({
      ...securityPolicy,
      allowedFolders: [...securityPolicy.allowedFolders, newFolder]
    });

    setNewFolderName('');
    setNewFolderPath('');
    setShowAddFolder(false);
  };

  const getExtensionIcon = (ext: string) => {
    if (ext === '.docx' || ext === '.txt') return <FileText className="w-4 h-4 text-blue-400" />;
    if (ext === '.xlsx' || ext === '.csv') return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    if (ext === '.pptx') return <Presentation className="w-4 h-4 text-amber-400" />;
    if (ext === '.pdf') return <FileText className="w-4 h-4 text-rose-400" />;
    return <FileCode className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Control de Acceso y Sistema de Permisos
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Define a qué carpetas específicas tiene acceso el agente (Documentos, Proyectos, Descargas) y qué tipos de archivo (.docx, .pdf, .pptx, .xlsx) puede leer o escribir.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Aislamiento Estricto Activo</span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('folders')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'folders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Carpetas Autorizadas ({securityPolicy.allowedFolders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('filetypes')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'filetypes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Tipos de Archivos (.docx, .pdf, .xlsx, .pptx)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition ${
              activeSubTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Registro de Auditoría ({securityPolicy.auditLog.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CARPETAS AUTORIZADAS */}
      {activeSubTab === 'folders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Carpetas con Acceso Concedido
              </h3>
              <p className="text-xs text-slate-400">
                El agente tiene estrictamente prohibido acceder a directorios fuera de esta lista.
              </p>
            </div>

            <button
              onClick={() => setShowAddFolder(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Añadir Carpeta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityPolicy.allowedFolders.map(folder => (
              <div
                key={folder.id}
                className={`p-4 rounded-xl border transition ${
                  folder.enabled
                    ? 'bg-slate-900/70 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <FolderLock className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{folder.name}</h4>
                      <code className="text-[11px] text-cyan-300 font-mono block truncate max-w-[200px]">
                        {folder.virtualPath}
                      </code>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFolderPermission(folder.id, 'enabled')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                      folder.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {folder.enabled ? 'Activa' : 'Desactivada'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {folder.description}
                </p>

                {/* Permissions Toggles */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleFolderPermission(folder.id, 'canRead')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
                      folder.canRead ? 'text-emerald-300 bg-emerald-950/40' : 'text-slate-500 bg-slate-900'
                    }`}
                  >
                    {folder.canRead ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>Lectura</span>
                  </button>

                  <button
                    onClick={() => toggleFolderPermission(folder.id, 'canWrite')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
                      folder.canWrite ? 'text-cyan-300 bg-cyan-950/40' : 'text-slate-500 bg-slate-900'
                    }`}
                  >
                    {folder.canWrite ? <Check className="w-3 h-3 text-cyan-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>Escritura</span>
                  </button>

                  <button
                    onClick={() => toggleFolderPermission(folder.id, 'canExecute')}
                    className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
                      folder.canExecute ? 'text-purple-300 bg-purple-950/40' : 'text-slate-500 bg-slate-900'
                    }`}
                  >
                    {folder.canExecute ? <Check className="w-3 h-3 text-purple-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>Ejecutar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Folder Modal */}
          {showAddFolder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderLock className="w-4 h-4 text-emerald-400" />
                    <span>Añadir Nueva Carpeta Autorizada</span>
                  </h3>
                  <button onClick={() => setShowAddFolder(false)} className="text-slate-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddFolder} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nombre de Referencia (ej. Backup, Informes)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Informes"
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Ruta en el Ordenador (ej. /home/usuario/Informes o C:\Usuarios\...)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/home/usuario/Informes"
                      value={newFolderPath}
                      onChange={e => setNewFolderPath(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddFolder(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Autorizar Carpeta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TIPOS DE ARCHIVOS PERMITIDOS */}
      {activeSubTab === 'filetypes' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Formatos de Archivo Autorizados (Lista Blanca)
            </h3>
            <p className="text-xs text-slate-400">
              Controla qué extensiones de documentos (.docx, .pdf, .xlsx, .pptx) y código puede abrir o generar el agente.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                  <th className="py-3 px-4">Extensión</th>
                  <th className="py-3 px-4">Tipo de Formato</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Descripción de Uso</th>
                  <th className="py-3 px-4 text-center">Permiso Lectura</th>
                  <th className="py-3 px-4 text-center">Permiso Escritura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {securityPolicy.allowedFileTypes.map(ft => (
                  <tr key={ft.extension} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getExtensionIcon(ft.extension)}
                        <span className="font-mono font-bold text-white">{ft.extension}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{ft.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {ft.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{ft.description}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFileTypePermission(ft.extension, 'canRead')}
                        className={`p-1 rounded transition ${
                          ft.canRead ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}
                        title="Alternar permiso de lectura"
                      >
                        {ft.canRead ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFileTypePermission(ft.extension, 'canWrite')}
                        className={`p-1 rounded transition ${
                          ft.canWrite ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'
                        }`}
                        title="Alternar permiso de escritura"
                      >
                        {ft.canWrite ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REGISTRO DE AUDITORÍA */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Registro de Auditoría de Acceso en Tiempo Real
            </h3>
            <p className="text-xs text-slate-400">
              Monitoreo y trazabilidad de todas las operaciones de lectura, escritura o bloqueos de seguridad.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400">
                  <th className="py-2.5 px-3">Hora</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Ruta de Archivo</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Verificación de Regla</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {securityPolicy.auditLog.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 text-slate-500">{entry.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-cyan-300">{entry.action}</td>
                    <td className="py-2.5 px-3 text-slate-200">{entry.targetPath}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.status === 'ALLOW' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{entry.reason}</td>
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
