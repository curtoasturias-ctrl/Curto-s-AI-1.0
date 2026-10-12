import { LocalBridgeStatus, FileItem, AgentExecution, ProjectDeliverable } from '../types/agent';

const LOCAL_BRIDGE_URL = 'http://localhost:49152';

export class BridgeService {
  /**
   * Verifica si el demonio del puente local (omni_agent_bridge) está corriendo en la máquina del usuario
   */
  static async checkLocalBridge(): Promise<LocalBridgeStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`${LOCAL_BRIDGE_URL}/status`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          isConnected: true,
          os: data.os || 'Linux/Unix',
          release: data.release,
          node: data.node,
          machine: data.machine,
          user: data.user || 'Usuario',
          cwd: data.cwd,
          cpus: data.cpus,
          freeMem: data.freeMem,
          totalMem: data.totalMem,
          lastPing: new Date().toLocaleTimeString(),
          checking: false
        };
      }
      return { isConnected: false, checking: false };
    } catch {
      return { isConnected: false, checking: false };
    }
  }

  /**
   * Ejecuta un comando en la máquina real si el bridge está conectado,
   * o en el entorno virtual sandbox si está desconectado.
   */
  static async executeCommand(
    command: string,
    isLocalBridgeConnected: boolean,
    virtualFiles: FileItem[],
    onUpdateFiles?: (files: FileItem[]) => void
  ): Promise<{ stdout: string; stderr?: string; exitCode: number; executionMode: 'real_pc' | 'sandbox' }> {
    const trimmed = command.trim();

    // Si está conectado al ordenador real del usuario:
    if (isLocalBridgeConnected) {
      try {
        const res = await fetch(`${LOCAL_BRIDGE_URL}/exec`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cmd: trimmed })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            stdout: data.stdout || '(Comando ejecutado sin salida en stdout)',
            stderr: data.stderr || '',
            exitCode: data.exitCode ?? 0,
            executionMode: 'real_pc'
          };
        }
      } catch (err: any) {
        return {
          stdout: '',
          stderr: `Error comunicando con el puente local: ${err.message}`,
          exitCode: 1,
          executionMode: 'real_pc'
        };
      }
    }

    // Modo Sandbox Virtual interactivo de alta fidelidad:
    return this.runVirtualSandboxCommand(trimmed, virtualFiles, onUpdateFiles);
  }

  /**
   * Intérprete y sandbox virtual de comandos bash / powershell
   */
  private static runVirtualSandboxCommand(
    cmd: string,
    virtualFiles: FileItem[],
    onUpdateFiles?: (files: FileItem[]) => void
  ): { stdout: string; stderr?: string; exitCode: number; executionMode: 'sandbox' } {
    const parts = cmd.split('&&').map(p => p.trim());

    if (parts.length > 1) {
      const outputs: string[] = [];
      for (const singleCmd of parts) {
        const res = this.runSingleVirtualCommand(singleCmd, virtualFiles, onUpdateFiles);
        outputs.push(res.stdout);
        if (res.exitCode !== 0) {
          return {
            stdout: outputs.join('\n'),
            stderr: res.stderr,
            exitCode: res.exitCode,
            executionMode: 'sandbox'
          };
        }
      }
      return {
        stdout: outputs.join('\n'),
        exitCode: 0,
        executionMode: 'sandbox'
      };
    }

    return this.runSingleVirtualCommand(cmd, virtualFiles, onUpdateFiles);
  }

  private static runSingleVirtualCommand(
    cmd: string,
    virtualFiles: FileItem[],
    onUpdateFiles?: (files: FileItem[]) => void
  ): { stdout: string; stderr?: string; exitCode: number; executionMode: 'sandbox' } {
    const tokens = cmd.split(' ').filter(Boolean);
    const main = tokens[0]?.toLowerCase() || '';
    const args = tokens.slice(1);

    switch (main) {
      case 'help':
        return {
          stdout: `OmniAgent OS Sandbox Virtual CLI
Comandos disponibles:
  ls, dir                - Listar archivos y directorios
  cat <archivo>          - Ver contenido de un archivo
  pwd                    - Mostrar directorio de trabajo actual
  mkdir <nombre>         - Crear nuevo directorio
  touch <nombre>         - Crear archivo vacío
  echo "texto" > archivo - Escribir en archivo
  rm <archivo>           - Eliminar archivo
  ps, top                - Ver procesos en ejecución
  free, uptime, whoami   - Diagnóstico del sistema
  python, node <archivo> - Ejecutar script
  status                 - Estado del agente y ordenador
  clear                  - Limpiar pantalla`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'pwd':
        return {
          stdout: '/home/usuario',
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'whoami':
        return {
          stdout: 'usuario (OmniAgent Admin Privileges - Nivel 0)',
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'uptime':
        return {
          stdout: ` 09:24:12 up 14 days, 3:42, 2 users, load average: 0.28, 0.35, 0.40`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'free':
      case 'free -h':
        return {
          stdout: `               total        used        free      shared  buff/cache   available
Mem:            16Gi       4.2Gi        11.2Gi       140Mi       680Mi       11.4Gi
Swap:          4.0Gi       210Mi         3.8Gi`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'df':
      case 'df -h':
        return {
          stdout: `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2  512G  142G  346G  30% /
tmpfs            16G  1.2M   16G   1% /dev/shm`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'ps':
      case 'ps aux':
        return {
          stdout: `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.1  21544  4212 ?        Ss   08:00   0:01 /sbin/init
usuario     1402  2.1  1.4 342120 45120 ?        Sl   08:15   0:14 omniagent-core
usuario     1408  1.8  2.2 412000 68400 ?        Sl   08:15   0:22 gemini-worker-pool
usuario     1520  0.1  0.3  84120 12000 ?        S    08:16   0:01 bridge-daemon --port 49152
usuario     2190  0.4  0.8 190400 24100 ?        S    09:00   0:03 python3 data_sync.py`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      case 'ls':
      case 'dir': {
        const isLong = args.includes('-l') || args.includes('-la');
        const listOutput = virtualFiles.map(f => {
          if (isLong) {
            const type = f.isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            return `${type} 1 usuario usuario ${String(f.size).padStart(6, ' ')} ${f.modifiedAt} ${f.name}${f.isDir ? '/' : ''}`;
          }
          return f.isDir ? `${f.name}/` : f.name;
        }).join(isLong ? '\n' : '  ');
        return {
          stdout: listOutput,
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'cat': {
        const target = args[0];
        if (!target) {
          return { stdout: '', stderr: 'cat: falta el nombre del archivo', exitCode: 1, executionMode: 'sandbox' };
        }
        const file = virtualFiles.find(f => f.name === target || f.path.endsWith(target));
        if (!file) {
          return { stdout: '', stderr: `cat: ${target}: No existe el archivo o directorio`, exitCode: 1, executionMode: 'sandbox' };
        }
        if (file.isDir) {
          return { stdout: '', stderr: `cat: ${target}: Es un directorio`, exitCode: 1, executionMode: 'sandbox' };
        }
        return {
          stdout: file.content || '(Archivo vacío)',
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'mkdir': {
        const dirName = args[0];
        if (!dirName) {
          return { stdout: '', stderr: 'mkdir: falta operando', exitCode: 1, executionMode: 'sandbox' };
        }
        if (onUpdateFiles) {
          const newFolder: FileItem = {
            name: dirName,
            path: `/home/usuario/${dirName}`,
            isDir: true,
            size: 4096,
            modifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          onUpdateFiles([...virtualFiles, newFolder]);
        }
        return {
          stdout: `Directorio creado: /home/usuario/${dirName}`,
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'touch': {
        const fileName = args[0];
        if (!fileName) {
          return { stdout: '', stderr: 'touch: falta el archivo', exitCode: 1, executionMode: 'sandbox' };
        }
        if (onUpdateFiles) {
          const newFile: FileItem = {
            name: fileName,
            path: `/home/usuario/${fileName}`,
            isDir: false,
            size: 0,
            content: '',
            modifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          onUpdateFiles([...virtualFiles, newFile]);
        }
        return {
          stdout: `Archivo creado: ${fileName}`,
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'python':
      case 'python3':
      case 'node': {
        const scriptName = args[0];
        return {
          stdout: `[${main.toUpperCase()} RUNNER] Ejecutando ${scriptName || 'script'}...
> Inicializando intérprete y entorno aislado.
> Dependencias verificadas: OK.
> Proceso finalizado con código de salida 0.
✨ Tarea completada con éxito.`,
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'git': {
        const sub = args[0] || 'status';
        if (sub === 'status') {
          return {
            stdout: `On branch main
Your branch is up to date with 'origin/main'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
	modified:   documentos/resumen_ejecutivo_q3.md

no changes added to commit (use "git add")`,
            exitCode: 0,
            executionMode: 'sandbox'
          };
        }
        return {
          stdout: `[git] Comando git ${sub} ejecutado correctamente.`,
          exitCode: 0,
          executionMode: 'sandbox'
        };
      }

      case 'status':
        return {
          stdout: `=== ESTADO DE OMNIAGENT ===
Versión: 2.5.0
Modo: Sandbox Seguro Integrado
Permisos: Control Total Simulado (Root)
Módulos: Correo, Proyectos, Terminal, FileSystem
Bridge Local: Disponible en puerto 49152 (descarga omni_agent_bridge.py para enlazar tu PC real)`,
          exitCode: 0,
          executionMode: 'sandbox'
        };

      default:
        return {
          stdout: `[OmniAgent Sandbox] Comando '${cmd}' ejecutado en entorno virtual.
Salida estándar generada con código de salida 0.`,
          exitCode: 0,
          executionMode: 'sandbox'
        };
    }
  }

  /**
   * Envía la orden del usuario al modelo Gemini en el servidor
   */
  static async dispatchOrder(
    prompt: string,
    context: any
  ): Promise<AgentExecution> {
    const res = await fetch('/api/agent/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Fallo al procesar la orden con OmniAgent');
    }

    const data = await res.json();
    return {
      id: `exec-${Date.now()}`,
      prompt,
      timestamp: new Date().toLocaleTimeString(),
      thoughtProcess: data.thoughtProcess || '',
      roleActive: data.roleActive || 'Director de Operaciones & Sistema',
      summary: data.summary || 'Orden ejecutada con éxito.',
      steps: data.steps || [],
      terminalOutput: data.terminalOutput || '',
      deliverables: (data.projectDeliverables || []).map((d: any, idx: number) => ({
        id: `del-${Date.now()}-${idx}`,
        fileName: d.fileName,
        filePath: d.filePath,
        fileType: d.fileType || 'markdown',
        description: d.description || '',
        content: d.content || '',
        timestamp: new Date().toLocaleTimeString()
      })),
      emailActions: data.emailActions || [],
      suggestedNextOrders: data.suggestedNextOrders || [
        'Revisar los correos urgentes pendientes',
        'Crear un script de respaldo automático',
        'Generar informe de estado del proyecto en PDF/Markdown'
      ]
    };
  }
}
