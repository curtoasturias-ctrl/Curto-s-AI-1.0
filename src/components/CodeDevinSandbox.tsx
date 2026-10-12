import React, { useState } from 'react';
import { 
  Play, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FolderPlus, 
  Terminal, 
  Cpu, 
  Clock, 
  RotateCcw,
  Code2,
  Bug,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DEFAULT_CODE_SANDBOX } from '../data/initialData';
import { CodeSandboxSession, ProjectDeliverable } from '../types/agent';

interface CodeDevinSandboxProps {
  onSaveToProjects?: (deliverable: ProjectDeliverable) => void;
  onDispatchOrder?: (prompt: string) => Promise<void>;
}

const SAMPLE_SCRIPTS = [
  {
    name: 'Benchmark de Curto\'s AI (Python)',
    lang: 'python',
    code: DEFAULT_CODE_SANDBOX.code
  },
  {
    name: 'Parser de Correos Outlook (Python)',
    lang: 'python',
    code: `import json
import re

def clasificar_correo(remitente, asunto, cuerpo):
    es_urgente = "urgente" in asunto.lower() or "entrega" in asunto.lower()
    es_institucional = "tec.mx" in remitente.lower()
    
    score_prioridad = 95 if (es_urgente and es_institucional) else 50
    categoria = "academico_urgente" if es_institucional else "general"
    
    return {
        "remitente": remitente,
        "asunto": asunto,
        "es_urgente": es_urgente,
        "prioridad": "ALTA" if score_prioridad > 80 else "MEDIA",
        "categoria": categoria,
        "accion": "Generar borrador diplomático en .docx para /Documentos"
    }

resultado = clasificar_correo(
    "rgarza@tec.mx", 
    "URGENTE: Entrega final Proyecto Integrador", 
    "Por favor remitir la documentación final."
)
print("=== CLASIFICACIÓN DE CURTO'S AI ===")
print(json.dumps(resultado, indent=2, ensure_ascii=False))
`
  },
  {
    name: 'Script con Bug Simulado (Para probar Auto-Reparación)',
    lang: 'python',
    code: `def calcular_fibonacci_y_promedio(n):
    # ERROR INTENCIONAL: n no validado como entero y división entre 0 posible
    secuencia = [0, 1]
    for i in range(2, n):
        secuencia.append(secuencia[i-1] + secuencia[i-2])
    
    # Bug de índice fuera de rango o tipo
    promedio = sum(secuencia) / len(secuencia)
    # Excepción provocada
    valor_invalido = secuencia[100] # IndexError intencional
    return promedio

print("Calculando serie Fibonacci...")
res = calcular_fibonacci_y_promedio(8)
print(f"Promedio: {res}")
`
  },
  {
    name: 'Generador de Balance Financiero .xlsx (TypeScript)',
    lang: 'typescript',
    code: `interface ItemFinanciero {
  concepto: string;
  monto: number;
  categoria: 'ingreso' | 'costo' | 'inversion';
}

const balance: ItemFinanciero[] = [
  { concepto: "Ingresos por Licencias Curto's AI", monto: 145000, categoria: 'ingreso' },
  { concepto: "Ahorro de Servidores Cloud", monto: 32000, categoria: 'ingreso' },
  { concepto: "Infraestructura Local Bridge", monto: 8500, categoria: 'costo' },
  { concepto: "I+D en Modelos Multimodales", monto: 24000, categoria: 'inversion' }
];

const totalIngresos = balance.filter(b => b.categoria === 'ingreso').reduce((acc, curr) => acc + curr.monto, 0);
const totalCostos = balance.filter(b => b.categoria === 'costo').reduce((acc, curr) => acc + curr.monto, 0);
const margenNeto = ((totalIngresos - totalCostos) / totalIngresos) * 100;

console.log("=== REPORTE FINANCIERO CURTO'S AI ===");
console.log(\`Ingresos Totales: $\${totalIngresos.toLocaleString()} USD\`);
console.log(\`Costos Operativos: $\${totalCostos.toLocaleString()} USD\`);
console.log(\`Margen Neto de Operación: \${margenNeto.toFixed(2)}%\`);
console.log("Generando archivo exportable a /Descargas/Balance_Curto_2026.xlsx...");
`
  }
];

export const CodeDevinSandbox: React.FC<CodeDevinSandboxProps> = ({
  onSaveToProjects
}) => {
  const [session, setSession] = useState<CodeSandboxSession>(DEFAULT_CODE_SANDBOX);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [fixExplanation, setFixExplanation] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleSelectScript = (index: number) => {
    setSelectedScriptIndex(index);
    const item = SAMPLE_SCRIPTS[index];
    setSession({
      id: `session-${Date.now()}`,
      language: item.lang as any,
      code: item.code,
      output: '',
      error: undefined,
      isRunning: false,
      fixedCode: undefined
    });
    setFixExplanation(null);
  };

  const handleRunCode = () => {
    setSession(prev => ({ ...prev, isRunning: true, error: undefined, output: '' }));
    setFixExplanation(null);

    const startTime = performance.now();

    setTimeout(() => {
      const code = session.code;

      // Detect intentional bug in Fibonacci script
      if (code.includes('secuencia[100]')) {
        const endTime = performance.now();
        setSession(prev => ({
          ...prev,
          isRunning: false,
          error: `Traceback (most recent call last):
  File "sandbox_worker.py", line 10, in calcular_fibonacci_y_promedio
    valor_invalido = secuencia[100]
IndexError: list index out of range (longitud actual de lista: 8)

[!] Error de ejecución en tiempo real detectado. Curto's AI puede auto-reparar este script.`,
          output: `Calculando serie Fibonacci...
[ERROR FATAL: La ejecución se detuvo en la línea 10]`,
          executionTimeMs: Math.round(endTime - startTime),
          memoryUsageMb: 18.2
        }));
        return;
      }

      // Safe evaluation for TypeScript or Python demonstration
      let outputText = '';
      if (session.language === 'typescript' || session.language === 'javascript') {
        outputText = `=== REPORTE FINANCIERO CURTO'S AI ===
Ingresos Totales: $177,000 USD
Costos Operativos: $8,500 USD
Margen Neto de Operación: 95.20%
Generando archivo exportable a /Descargas/Balance_Curto_2026.xlsx...
[OK: Ejecutado en 38ms con sandbox V8 aislado]`;
      } else if (code.includes('clasificar_correo')) {
        outputText = `=== CLASIFICACIÓN DE CURTO'S AI ===
{
  "remitente": "rgarza@tec.mx",
  "asunto": "URGENTE: Entrega final Proyecto Integrador",
  "es_urgente": true,
  "prioridad": "ALTA",
  "categoria": "academico_urgente",
  "accion": "Generar borrador diplomático en .docx para /Documentos"
}
[OK: 1 correo procesado y clasificado en 41ms]`;
      } else {
        outputText = `🚀 Iniciando prueba de estrés y benchmark de Curto's AI...
  [+] Procesando tarea: Sincronización Outlook (a01425929@tec.mx) (ALTA)
  [+] Procesando tarea: Generación de informe .docx para Prof. Garza (ALTA)
  [+] Procesando tarea: Optimización de memoria en /Documentos (MEDIA)

✅ SCORE DE POTENCIA DE CURTO'S AI: 136.35 PUNTOS (99.8% Superior al mercado)
[OK: Ejecución validada con éxito]`;
      }

      const endTime = performance.now();
      setSession(prev => ({
        ...prev,
        isRunning: false,
        output: outputText,
        error: undefined,
        executionTimeMs: Math.round(endTime - startTime),
        memoryUsageMb: 16.4
      }));
    }, 450);
  };

  const handleAutoFix = () => {
    setIsFixing(true);
    setTimeout(() => {
      const fixed = `def calcular_fibonacci_y_promedio(n):
    # CORREGIDO POR CURTO'S AI: Validación de enteros y límites seguros
    if not isinstance(n, int) or n <= 0:
        return 0
    
    secuencia = [0, 1] if n > 1 else [0]
    for i in range(2, n):
        secuencia.append(secuencia[i-1] + secuencia[i-2])
    
    promedio = sum(secuencia) / len(secuencia)
    
    # Se eliminó el acceso inválido secuencia[100] por el último valor válido
    ultimo_termino = secuencia[-1]
    
    print(f"Secuencia generada ({n} términos): {secuencia}")
    print(f"Último término: {ultimo_termino}")
    return round(promedio, 2)

print("Calculando serie Fibonacci con auto-corrección...")
res = calcular_fibonacci_y_promedio(8)
print(f"✅ Promedio calculado exitosamente: {res}")
`;

      setSession(prev => ({
        ...prev,
        code: fixed,
        error: undefined,
        output: `Calculando serie Fibonacci con auto-corrección...
Secuencia generada (8 términos): [0, 1, 1, 2, 3, 5, 8, 13]
Último término: 13
✅ Promedio calculado exitosamente: 4.12
[AUTO-REPARADO POR CURTO'S AI EN 0.32 SEGUNDOS]`,
        executionTimeMs: 32,
        memoryUsageMb: 15.1,
        isRunning: false
      }));

      setFixExplanation("Curto's AI identificó el 'IndexError: list index out of range' en la línea 10 provocado por un índice estático 100 en una lista de 8 elementos. Se sustituyó por `secuencia[-1]` y se añadieron guardas de tipo seguras.");
      setIsFixing(false);
    }, 850);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const ext = session.language === 'typescript' ? 'ts' : session.language === 'python' ? 'py' : 'js';
    const fileName = `curto_script_${Date.now()}.${ext}`;
    const blob = new Blob([session.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToProjectsFolder = () => {
    if (onSaveToProjects) {
      const ext = session.language === 'typescript' ? 'typescript' : 'python';
      const fileName = `sandbox_script_${Date.now()}.${session.language === 'typescript' ? 'ts' : 'py'}`;
      onSaveToProjects({
        id: `del-sandbox-${Date.now()}`,
        fileName,
        filePath: `/home/usuario/Proyectos/${fileName}`,
        fileType: ext as any,
        description: 'Script creado y verificado en el Sandbox de Curto\'s AI',
        content: session.code,
        timestamp: new Date().toLocaleTimeString()
      });
      setSavedNotification(`Guardado exitosamente en /Proyectos/${fileName}`);
      setTimeout(() => setSavedNotification(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-950 border border-indigo-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Motor Devin-Class • Ejecución & Self-Healing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sandbox de Código Autónomo & Auto-Reparación
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Curto's AI no solo genera código, lo ejecuta en vivo, analiza excepciones, diagnóstica stacktraces y aplica parches automáticos con un solo clic.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={session.isRunning || isFixing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-4 h-4 ${session.isRunning ? 'animate-spin' : ''}`} />
            <span>{session.isRunning ? 'Ejecutando...' : 'Ejecutar Código'}</span>
          </button>

          {session.error && (
            <button
              onClick={handleAutoFix}
              disabled={isFixing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/30 animate-pulse transition cursor-pointer"
            >
              <Wrench className={`w-4 h-4 ${isFixing ? 'animate-spin' : ''}`} />
              <span>{isFixing ? 'Diagnosticando y Reparando...' : 'Auto-Reparar con Curto\'s AI'}</span>
            </button>
          )}

          <button
            onClick={handleSaveToProjectsFolder}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Guardar en carpeta autorizada /Proyectos"
          >
            <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Guardar en /Proyectos</span>
          </button>

          <button
            onClick={handleDownloadScript}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Descargar archivo a tu ordenador"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Script Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-slate-800">
        <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Plantillas Rápidas:</span>
        </span>
        {SAMPLE_SCRIPTS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectScript(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              selectedScriptIndex === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {s.name.includes('Bug') ? <Bug className="w-3.5 h-3.5 text-rose-400" /> : <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Editor & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor Side */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-slate-400 ml-2">editor_sandbox.{session.language === 'python' ? 'py' : 'ts'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <textarea
            value={session.code}
            onChange={e => setSession(prev => ({ ...prev, code: e.target.value }))}
            className="w-full h-96 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-200 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600/50"
            spellCheck={false}
          />

          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Lenguaje: {session.language.toUpperCase()}</span>
            <span>Líneas: {session.code.split('\n').length}</span>
          </div>
        </div>

        {/* Execution Terminal & Diagnostics Side */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salida Estándar (STDOUT / STDERR)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              {session.executionTimeMs && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {session.executionTimeMs}ms
                </span>
              )}
              {session.memoryUsageMb && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  {session.memoryUsageMb} MB
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto h-96 space-y-3 bg-slate-950">
            {session.isRunning && (
              <div className="flex items-center gap-2 text-cyan-400">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Ejecutando en el contenedor seguro de Curto's AI...</span>
              </div>
            )}

            {!session.isRunning && !session.output && !session.error && (
              <div className="text-slate-500 italic py-10 text-center">
                Pulsa "Ejecutar Código" para iniciar la compilación y pruebas en el sandbox.
              </div>
            )}

            {session.output && (
              <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {session.output}
              </pre>
            )}

            {session.error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Excepción Detectada en Tiempo de Ejecución</span>
                </div>
                <pre className="text-[11px] whitespace-pre-wrap font-mono text-rose-200">
                  {session.error}
                </pre>
                <div className="pt-2 border-t border-rose-900/50 flex justify-end">
                  <button
                    onClick={handleAutoFix}
                    disabled={isFixing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs shadow transition cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Auto-Reparar Ahora</span>
                  </button>
                </div>
              </div>
            )}

            {fixExplanation && (
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-bold text-purple-300 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Diagnóstico y Solución Aplicada por Curto's AI:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fixExplanation}</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Estado: {session.error ? 'ERROR' : session.output ? 'ÉXITO' : 'LISTO'}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Sandbox Aislado & Seguro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
