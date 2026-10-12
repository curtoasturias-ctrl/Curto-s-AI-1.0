import { 
  Email, 
  Project, 
  FileItem, 
  SystemProcess, 
  PendingTask, 
  SecurityPolicy, 
  EmailTemplate, 
  EmailClassificationRule,
  EmailAccountConfig,
  SuperAutopilotChain,
  AIBenchmarkComparison,
  CodeSandboxSession,
  ConversationSession,
  ChatMessage
} from '../types/agent';

export const INITIAL_EMAIL_ACCOUNT: EmailAccountConfig = {
  provider: 'outlook',
  accountEmail: 'a01425929@tec.mx',
  userName: 'Matrícula a01425929 • Tecnológico de Monterrey (Microsoft 365 / Outlook)',
  connected: true,
  lastSync: 'Hoy, 09:44 AM'
};

export const OUTLOOK_EMAILS: Email[] = [
  {
    id: 'em-tec-101',
    sender: 'Prof. Roberto Garza (Tec de Monterrey)',
    senderEmail: 'rgarza@tec.mx',
    subject: 'URGENTE [Proyecto Integrador]: Entrega final de Agentes Autónomos y Repositorio',
    snippet: 'Estimado/a estudiante a01425929, nos encontramos en la fecha límite para la entrega...',
    body: `Estimado/a estudiante a01425929,

Nos encontramos en la fecha límite para la entrega del Proyecto Integrador del Bloque de Inteligencia Artificial y Sistemas Autónomos en el Tecnológico de Monterrey.

Requisitos de entrega para hoy antes de las 23:59:
1. Informe técnico completo en formato .docx o .pdf archivado en la carpeta /Documentos.
2. Scripts de prueba en Python y validación de ejecución en terminal en /Proyectos.
3. Verificación de políticas de seguridad para carpetas autorizadas (Documentos, Proyectos, Descargas).

Por favor, confirma la recepción de este correo institucional y remite el estado de los entregables validados.

Saludos cordiales,
Prof. Roberto Garza
Director de Departamento de Computación | Escuela de Ingeniería y Ciencias
Tecnológico de Monterrey`,
    date: 'Hoy, 09:42 AM',
    read: false,
    starred: true,
    priority: 'alta',
    category: 'urgente',
    draftReply: `Estimado Prof. Roberto Garza,

Le confirmo la recepción de su correo institucional respecto a la entrega de la matrícula a01425929.
El proyecto de Agentes Autónomos está 100% finalizado y verificado:

1. El informe técnico formal ha sido generado en .docx dentro de /Documentos/propuesta_comercial_q4.docx.
2. Los scripts de ejecución y arquitectura se encuentran en /Proyectos/api_server.py y scripts de mantenimiento.
3. Las políticas de aislamiento estricto y listas blancas (.docx, .pdf, .xlsx, .pptx) están activas en el sistema.

Quedo a su disposición para cualquier duda en la evaluación final.

Atentamente,
Estudiante a01425929 | Tecnológico de Monterrey`,
    replySent: false,
    matchedRuleId: 'rule-1',
    usedTemplateId: 'tpl-1'
  },
  {
    id: 'em-tec-102',
    sender: 'Sofía Villarreal (Equipo de Proyecto)',
    senderEmail: 'a01704512@tec.mx',
    subject: 'Avance del Sprint: Revisión de métricas y scripts de automatización del agente',
    snippet: 'Hola! Acabo de revisar los scripts que corriste en la terminal. Todo compiló perfecto...',
    body: `¡Hola compañero a01425929!

Acabo de revisar los scripts que corriste en la terminal del agente y la conexión con Outlook. Todo compiló perfecto y el control de acceso en las carpetas de Documentos y Proyectos funciona genial.

Ya subí la hoja de cálculo en .xlsx con los tiempos de respuesta y análisis de costes a la carpeta /Descargas.
¿Me confirmas si puedes mandar el borrador final al profesor Roberto Garza hoy?

¡Mucho éxito con la entrega!
Sofía Villarreal (a01704512)`,
    date: 'Hoy, 09:15 AM',
    read: false,
    starred: true,
    priority: 'alta',
    category: 'proyecto',
    draftReply: `Hola Sofía,

Confirmado. Ya tengo sincronizada la cuenta a01425929@tec.mx en Outlook y preparé el borrador formal para el profesor Garza con todos los entregables.

Revisé la hoja .xlsx de costes en /Descargas y la incorporé en el resumen ejecutivo. Te aviso en cuanto tenga la confirmación final.

Saludos cordiales!`,
    replySent: false,
    matchedRuleId: 'rule-4',
    usedTemplateId: 'tpl-2'
  },
  {
    id: 'em-tec-103',
    sender: 'Canvas Notificaciones Tec',
    senderEmail: 'notifications@instructure.com',
    subject: '[Canvas Tec] Nuevo anuncio: Rúbrica de evaluación de Agentes Inteligentes',
    snippet: 'Se ha publicado un nuevo anuncio en tu curso de Computación Inteligente...',
    body: `ANUNCIO OFICIAL EN CANVAS - TECNOLÓGICO DE MONTERREY
Curso: Inteligencia Artificial Avanzada & Agentes de Software
Profesor: Roberto Garza
Estudiante: a01425929@tec.mx

Aviso:
Se ha publicado la rúbrica detallada para la presentación final. Recuerden que se evaluará la autonomía del agente en consola, la gestión de correo electrónico por Outlook/Exchange y la robustez del control de acceso a archivos del ordenador.`,
    date: 'Hoy, 08:30 AM',
    read: true,
    starred: false,
    priority: 'media',
    category: 'trabajo',
    replySent: false,
    matchedRuleId: 'rule-3',
    usedTemplateId: 'tpl-3'
  },
  {
    id: 'em-tec-104',
    sender: 'Servicios Escolares Tec',
    senderEmail: 'serviciosescolares@tec.mx',
    subject: 'Constancia oficial de inscripción y estatus académico 2026 - a01425929',
    snippet: 'Estimado/a estudiante a01425929, confirmamos tu registro académico en el campus...',
    body: `Estimado/a estudiante a01425929,

Le informamos que su estatus de inscripción académica en el Tecnológico de Monterrey para el periodo en curso se encuentra validado y activo.

Matrícula: a01425929
Correo Institucional: a01425929@tec.mx
Campus: Monterrey / Nacional
Estatus: Alumno regular activo

Puede descargar su constancia con firma digital desde mitec o solicitar copias adicionales en el portal de Servicios Escolares.`,
    date: 'Ayer, 15:45',
    read: true,
    starred: false,
    priority: 'baja',
    category: 'factura',
    replySent: false,
    matchedRuleId: 'rule-2',
    usedTemplateId: 'tpl-4'
  }
];

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Aprobación Formal & Desglose de Presupuesto',
    category: 'finanzas',
    tone: 'formal',
    description: 'Plantilla para confirmar presupuestos y cronogramas con directores y clientes.',
    templateText: `Estimado/a {remitente},

Hemos revisado detalladamente su solicitud respecto a {asunto}.
Le confirmamos la validación del presupuesto y los entregables correspondientes.

Desglose confirmado:
- Entregables acordados según especificación en /Documentos.
- Fechas de entrega y despliegue dentro del cronograma previsto.
- Equipo técnico asignado e inicio de ejecución inmediato.

Quedamos a su disposición para cualquier aclaración adicional.

Atentamente,
OmniAgent Executive Desk`
  },
  {
    id: 'tpl-2',
    name: 'Respuesta Rápida Ejecutiva',
    category: 'general',
    tone: 'conciso',
    description: 'Respuesta breve y directa confirmando recepción y próxima acción en menos de 3 líneas.',
    templateText: `Hola {remitente},

Recibido correctamente. Estamos procesando los requerimientos de "{asunto}" y te enviaremos la actualización con los archivos adjuntos hoy mismo.

Saludos cordiales.`
  },
  {
    id: 'tpl-3',
    name: 'Soporte Técnico & Alerta de Infraestructura',
    category: 'tecnico',
    tone: 'tecnico',
    description: 'Plantilla para incidentes de servidores, caídas o alertas de tráfico.',
    templateText: `Equipo de Operaciones,

Incidencia detectada y mitigada para: {asunto}.
- Diagnóstico en consola ejecutado con éxito.
- Recursos de CPU y memoria estabilizados.
- Logs de verificación archivados en /Proyectos/telemetria.

El servicio se encuentra operando dentro de los parámetros habituales.`
  },
  {
    id: 'tpl-4',
    name: 'Confirmación y Recepción de Facturas',
    category: 'facturas',
    tone: 'formal',
    description: 'Acuse de recibo de facturas proforma y transferencias contables.',
    templateText: `Estimado Departamento de Facturación,

Confirmamos la recepción de la factura indicada en "{asunto}".
Ha sido registrada en el sistema de control de costes y enviada a tramitación bancaria para su abono antes de la fecha de vencimiento.

Muchas gracias por su atención.`
  }
];

export const INITIAL_EMAIL_RULES: EmailClassificationRule[] = [
  {
    id: 'rule-1',
    name: 'Prioridad Directores & Presupuestos',
    conditionType: 'sender_contains',
    value: '@innovatech.es',
    assignedCategory: 'urgente',
    assignedTemplateId: 'tpl-1',
    autoDraftReply: true
  },
  {
    id: 'rule-2',
    name: 'Facturas y Justificantes Contables',
    conditionType: 'subject_contains',
    value: 'Factura',
    assignedCategory: 'factura',
    assignedTemplateId: 'tpl-4',
    autoDraftReply: true
  },
  {
    id: 'rule-3',
    name: 'Alertas de Servidores y Cloud',
    conditionType: 'subject_contains',
    value: 'ALERTA',
    assignedCategory: 'trabajo',
    assignedTemplateId: 'tpl-3',
    autoDraftReply: true
  },
  {
    id: 'rule-4',
    name: 'Propuestas de Alianzas y Clientes',
    conditionType: 'subject_contains',
    value: 'Propuesta',
    assignedCategory: 'cliente',
    assignedTemplateId: 'tpl-2',
    autoDraftReply: true
  }
];

export const INITIAL_SECURITY_POLICY: SecurityPolicy = {
  strictFolderIsolation: true,
  blockSystemDirectories: true,
  requireConfirmationOnWrite: false,
  allowedFolders: [
    {
      id: 'fld-doc',
      name: 'Documentos',
      virtualPath: '/home/usuario/Documentos',
      realPathHint: '~/Documentos (o C:\\Users\\...\\Documents)',
      canRead: true,
      canWrite: true,
      canExecute: false,
      enabled: true,
      description: 'Archivos de texto, informes ejecutivos, contratos y hojas de cálculo.'
    },
    {
      id: 'fld-proj',
      name: 'Proyectos',
      virtualPath: '/home/usuario/Proyectos',
      realPathHint: '~/Proyectos (o C:\\Users\\...\\Projects)',
      canRead: true,
      canWrite: true,
      canExecute: true,
      enabled: true,
      description: 'Código fuente, scripts de automatización, configuraciones Docker y repositorios.'
    },
    {
      id: 'fld-down',
      name: 'Descargas',
      virtualPath: '/home/usuario/Descargas',
      realPathHint: '~/Descargas (o C:\\Users\\...\\Downloads)',
      canRead: true,
      canWrite: true,
      canExecute: false,
      enabled: true,
      description: 'Archivos descargados de internet, adjuntos de correo y temporales.'
    }
  ],
  allowedFileTypes: [
    {
      extension: '.docx',
      name: 'Documento Microsoft Word',
      category: 'office',
      canRead: true,
      canWrite: true,
      description: 'Lectura y redacción de informes, propuestas comerciales y contratos.'
    },
    {
      extension: '.pdf',
      name: 'Documento Portable (PDF)',
      category: 'office',
      canRead: true,
      canWrite: true,
      description: 'Extracción de texto, facturas, manuales y generación de documentos finales.'
    },
    {
      extension: '.xlsx',
      name: 'Hoja de Cálculo Excel',
      category: 'office',
      canRead: true,
      canWrite: true,
      description: 'Tablas de contabilidad, costes, inventarios y análisis de métricas.'
    },
    {
      extension: '.pptx',
      name: 'Presentación PowerPoint',
      category: 'office',
      canRead: true,
      canWrite: true,
      description: 'Diapositivas ejecutivas, resúmenes de proyectos y reuniones.'
    },
    {
      extension: '.md',
      name: 'Markdown Document',
      category: 'code',
      canRead: true,
      canWrite: true,
      description: 'Documentación técnica, guías de operación y resúmenes.'
    },
    {
      extension: '.py',
      name: 'Script Python',
      category: 'code',
      canRead: true,
      canWrite: true,
      description: 'Scripts de automatización de tareas locales y análisis.'
    },
    {
      extension: '.ts',
      name: 'Código TypeScript',
      category: 'code',
      canRead: true,
      canWrite: true,
      description: 'Desarrollo de módulos de software y aplicaciones web.'
    },
    {
      extension: '.json',
      name: 'Datos Estructurados JSON',
      category: 'data',
      canRead: true,
      canWrite: true,
      description: 'Configuraciones del sistema, reglas de triaje y exportaciones.'
    },
    {
      extension: '.csv',
      name: 'Datos Tabulares CSV',
      category: 'data',
      canRead: true,
      canWrite: true,
      description: 'Exportaciones de bases de datos y registros tabulares.'
    },
    {
      extension: '.txt',
      name: 'Texto Plano',
      category: 'office',
      canRead: true,
      canWrite: true,
      description: 'Notas rápidas, registros de log y borradores.'
    }
  ],
  auditLog: [
    {
      id: 'aud-1',
      timestamp: 'Hoy, 09:20:15',
      action: 'READ',
      targetPath: '/home/usuario/Documentos/resumen_ejecutivo_q3.docx',
      fileExtension: '.docx',
      status: 'ALLOW',
      reason: 'Carpeta "Documentos" autorizada con permisos de Lectura/Escritura para .docx'
    },
    {
      id: 'aud-2',
      timestamp: 'Hoy, 09:21:40',
      action: 'WRITE',
      targetPath: '/home/usuario/Proyectos/api_server.py',
      fileExtension: '.py',
      status: 'ALLOW',
      reason: 'Carpeta "Proyectos" autorizada con permisos de Escritura y Ejecución para .py'
    },
    {
      id: 'aud-3',
      timestamp: 'Hoy, 09:22:04',
      action: 'BLOCKED',
      targetPath: '/etc/shadow',
      status: 'DENY',
      reason: 'BLOQUEADO: Acceso fuera de carpetas permitidas. Aislamiento estricto activo.'
    }
  ]
};

export const INITIAL_PENDING_TASKS: PendingTask[] = [
  {
    id: 'task-101',
    title: 'Revisar y responder con borrador al correo urgente de Carlos Mendoza',
    description: 'Analizar solicitud de presupuesto Sprint 3, aplicar plantilla formal y guardar confirmación.',
    priority: 'alta',
    category: 'Correo & Finanzas',
    completed: false,
    createdAt: 'Hoy, 09:15'
  },
  {
    id: 'task-102',
    title: 'Generar propuesta técnica comercial en .docx y guardarla en /Documentos',
    description: 'Crear documento formal con desglose de arquitectura de agentes autónomos y costes.',
    priority: 'alta',
    category: 'Documentos',
    completed: false,
    createdAt: 'Hoy, 09:18'
  },
  {
    id: 'task-103',
    title: 'Analizar hoja de cálculo .xlsx de costes cloud en /Descargas',
    description: 'Extraer resumen de gastos mensuales de infraestructura y verificar desviaciones presupuestarias.',
    priority: 'media',
    category: 'Datos & Office',
    completed: false,
    createdAt: 'Hoy, 09:20'
  },
  {
    id: 'task-104',
    title: 'Ejecutar script de auditoría y diagnóstico de memoria del ordenador',
    description: 'Lanzar script en consola para verificar procesos de alto consumo y registrar telemetría.',
    priority: 'media',
    category: 'Sistema & PC',
    completed: false,
    createdAt: 'Hoy, 09:22'
  },
  {
    id: 'task-105',
    title: 'Organizar y categorizar archivos antiguos en la carpeta /Descargas',
    description: 'Clasificar descargas por tipo (.pdf, .xlsx, .docx) y archivar temporales.',
    priority: 'baja',
    category: 'Mantenimiento',
    completed: false,
    createdAt: 'Hoy, 09:25'
  }
];

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'em-101',
    sender: 'Carlos Mendoza',
    senderEmail: 'carlos.mendoza@innovatech.es',
    subject: 'URGENTE: Aprobación de presupuesto y entrega de entregables Sprint 3',
    snippet: 'Hola, necesitamos confirmar la propuesta económica antes de las 18:00...',
    body: `Estimado equipo,

Nos encontramos en la fase final de cierre del trimestre y requerimos con máxima urgencia la aprobación del presupuesto detallado del Sprint 3 para la plataforma SaaS.

Puntos clave requeridos:
1. Desglose de horas de desarrollo backend y DevOps.
2. Confirmación de fecha de despliegue en producción.
3. Costes de infraestructura cloud estimados para el próximo semestre.

Por favor, revisad los números y enviadnos la confirmación o el documento actualizado hoy mismo.

Un cordial saludo,
Carlos Mendoza
Director de Tecnología | InnovaTech Solutions`,
    date: 'Hoy, 09:12 AM',
    read: false,
    starred: true,
    priority: 'alta',
    category: 'urgente',
    draftReply: `Estimado Carlos Mendoza,

Hemos revisado detalladamente su solicitud respecto a la Aprobación de presupuesto Sprint 3.
Le confirmamos la validación del presupuesto y los entregables correspondientes.

Desglose confirmado:
- Entregables acordados según especificación en /Documentos/presupuesto_sprint3.docx.
- Fechas de entrega y despliegue dentro del cronograma previsto para el día 18.
- Estimación de costes cloud en 420€/mes con arquitectura serverless optimizada.

El documento formal ya ha sido archivado en /Documentos para su descarga.

Atentamente,
OmniAgent Executive Desk`,
    replySent: false,
    matchedRuleId: 'rule-1',
    usedTemplateId: 'tpl-1'
  },
  {
    id: 'em-102',
    sender: 'Lucía Fernández',
    senderEmail: 'l.fernandez@nexusdesign.io',
    subject: 'Nuevos diseños UI/UX del Dashboard y Feedback de Componentes',
    snippet: 'Te adjunto los mockups de Figma para el nuevo panel de métricas...',
    body: `¡Hola!

Acabamos de subir a Figma los nuevos componentes del panel de control:
- Modo oscuro refinado con paleta Slate & Cyan.
- Nueva tarjeta de telemetría de CPU y memoria en tiempo real.
- Rediseño del visor de archivos y editor de código integrado.

¿Podrías hacer una revisión técnica para verificar la viabilidad de implementación en React con Tailwind CSS?

¡Quedo atenta a tus comentarios!
Lucía`,
    date: 'Hoy, 08:35 AM',
    read: false,
    starred: false,
    priority: 'media',
    category: 'proyecto',
    replySent: false
  },
  {
    id: 'em-103',
    sender: 'Alertas AWS CloudWatch',
    senderEmail: 'no-reply@cloudwatch.amazonaws.com',
    subject: '[ALERTA INFORMATIVA] Pico de tráfico detectado en api-gateway-prod',
    snippet: 'Umbral superado: Solicitudes/minuto aumentaron un 34% en los últimos 20 min...',
    body: `ALERTA AUTOMÁTICA DEL SISTEMA
Región: eu-west-1 (Irlanda)
Servicio: API Gateway & CloudFront
Métrica: RequestsPerMinute > 12,000
Estado actual: ALERTA (Recuperándose)
Acción recomendada: Verificar logs en CloudWatch y escalar réplicas de contenedores si la latencia supera los 250ms.`,
    date: 'Ayer, 23:45',
    read: true,
    starred: false,
    priority: 'alta',
    category: 'trabajo',
    replySent: false,
    matchedRuleId: 'rule-3',
    usedTemplateId: 'tpl-3'
  },
  {
    id: 'em-104',
    sender: 'Departamento Financiero',
    senderEmail: 'facturas@corporate-services.com',
    subject: 'Factura F-2026-089: Renovación licencias anuales de software',
    snippet: 'Adjuntamos factura correspondiente al periodo 2026-2027 para su abono...',
    body: `Estimado cliente,

Le remitimos la factura proforma F-2026-089 por importe de 1.450,00 € correspondiente a la renovación de suscripciones y licencias para servidores de cómputo.

Vencimiento: 30 días naturales.
Rogamos confirmación de recepción y trámite para pago bancario.`,
    date: 'Ayer, 16:20',
    read: true,
    starred: false,
    priority: 'media',
    category: 'factura',
    replySent: false,
    matchedRuleId: 'rule-2',
    usedTemplateId: 'tpl-4'
  },
  {
    id: 'em-105',
    sender: 'Alejandro Ramos',
    senderEmail: 'aramos@globaltech-partners.com',
    subject: 'Propuesta de Colaboración: Integración de Agentes Autónomos',
    snippet: 'Nos gustaría agendar una reunión de 30 minutos para explorar sinergias...',
    body: `Buenos días,

Hemos seguido de cerca vuestros avances en automatización y agentes de sistema con acceso local y gestión de procesos.
Nos gustaría explorar una alianza estratégica para integrar vuestro motor en nuestros clientes corporativos de banca y seguros.

¿Tendrías disponibilidad este jueves a las 11:30 CET para una videollamada corta?

Un saludo,
Alejandro Ramos
Head of Business Development`,
    date: '04 Oct, 11:00',
    read: true,
    starred: true,
    priority: 'alta',
    category: 'cliente',
    replySent: false,
    matchedRuleId: 'rule-4',
    usedTemplateId: 'tpl-2'
  }
];

export const INITIAL_FILES: FileItem[] = [
  {
    name: 'propuesta_comercial_q4.docx',
    path: '/home/usuario/Documentos/propuesta_comercial_q4.docx',
    isDir: false,
    size: 28400,
    modifiedAt: '2026-10-06 09:20',
    extension: 'docx',
    formatCategory: 'office',
    content: `[DOCUMENTO MICROSOFT WORD .DOCX - PROCESADO POR OMNIAGENT]
TÍTULO: Propuesta Comercial & Arquitectura de Agentes Autónomos Q4
CLIENTE: InnovaTech Solutions & Partners
FECHA: Octubre 2026
AUTOR: OmniAgent Executive Engine

1. RESUMEN EJECUTIVO
Se propone la implantación de un sistema de agentes inteligentes con acceso seguro a carpetas locales (Documentos, Proyectos, Descargas) y compatibilidad nativa con documentos .docx, .pdf, .xlsx y .pptx.

2. ESPECIFICACIÓN DE SEGURIDAD
- Control de acceso basado en listas blancas por extensión.
- Aislamiento estricto de directorios del sistema operativo.
- Registro de auditoría para cada operación de lectura y escritura.

3. HITOS DE IMPLANTACIÓN
- Semana 1: Configuración de permisos y enlace bridge local.
- Semana 2: Triaje automático de bandejas de entrada Gmail y Outlook.
- Semana 3: Despliegue de cola de tareas priorizadas.`
  },
  {
    name: 'informe_financiero_2026.xlsx',
    path: '/home/usuario/Descargas/informe_financiero_2026.xlsx',
    isDir: false,
    size: 45200,
    modifiedAt: '2026-10-06 08:45',
    extension: 'xlsx',
    formatCategory: 'office',
    content: `[HOJA DE CÁLCULO MICROSOFT EXCEL .XLSX - DATOS TABULARES]
Hoja 1: Resumen de Costes de Infraestructura Cloud

Mes        | Cómputo CPU | Almacenamiento | Ancho de Banda | Total
Enero      | 180 €       | 45 €           | 25 €           | 250 €
Febrero    | 195 €       | 48 €           | 30 €           | 273 €
Marzo      | 210 €       | 50 €           | 32 €           | 292 €
Septiembre | 260 €       | 62 €           | 45 €           | 367 €
Octubre    | 285 €       | 70 €           | 55 €           | 410 €

Promedio Mensual: 318.40 €
Desviación presupuestaria: +4.2% (Dentro de los márgenes previstos)`
  },
  {
    name: 'presentacion_estrategica.pptx',
    path: '/home/usuario/Documentos/presentacion_estrategica.pptx',
    isDir: false,
    size: 112000,
    modifiedAt: '2026-10-05 16:30',
    extension: 'pptx',
    formatCategory: 'office',
    content: `[PRESENTACIÓN MICROSOFT POWERPOINT .PPTX - 6 DIAPOSITIVAS]
Diapositiva 1: Portada - Transformación Digital con OmniAgent OS
Diapositiva 2: El Desafío - Sobrecarga de correos y dispersión de tareas
Diapositiva 3: La Solución - Agente Autónomo con Control Local Supervisado
Diapositiva 4: Seguridad - Carpetas autorizadas y extensiones permitidas
Diapositiva 5: Resultados - Ahorro de 12 horas semanales por directivo
Diapositiva 6: Hoja de Ruta Q4 2026 - Integraciones avanzadas`
  },
  {
    name: 'contrato_servicios_confidencial.pdf',
    path: '/home/usuario/Documentos/contrato_servicios_confidencial.pdf',
    isDir: false,
    size: 89400,
    modifiedAt: '2026-10-04 11:10',
    extension: 'pdf',
    formatCategory: 'office',
    content: `[DOCUMENTO ADOBE ACROBAT .PDF - DOCUMENTO FORMAL]
ACUERDO DE NIVEL DE SERVICIO (SLA) Y POLÍTICA DE SEGURIDAD
Cláusula 1: El agente de software actuará únicamente sobre las carpetas explícitamente autorizadas por el usuario: Documentos, Proyectos y Descargas.
Cláusula 2: El procesamiento de correos electrónicos respetará las plantillas aprobadas por el titular.
Cláusula 3: Queda prohibida la extracción de datos sin el consentimiento expreso en la interfaz de usuario.`
  },
  {
    name: 'analisis_sistema.sh',
    path: '/home/usuario/Proyectos/analisis_sistema.sh',
    isDir: false,
    size: 640,
    modifiedAt: '2026-10-06 09:10',
    extension: 'sh',
    formatCategory: 'code',
    content: `#!/usr/bin/env bash
# Script de diagnóstico rápido del ordenador
echo "=== AUDITORÍA DEL SISTEMA ==="
echo "Fecha: $(date)"
echo "Uptime: $(uptime)"
echo "Memoria Libre:"
free -h 2>/dev/null || vm_stat
echo "Espacio en Disco:"
df -h /
echo "Top 5 procesos por CPU:"
ps aux --sort=-%cpu 2>/dev/null | head -n 6 || ps -eo pid,pcpu,comm | head -n 6
echo "=== ESTADO: ÓPTIMO ==="`
  },
  {
    name: 'limpieza_temporales.py',
    path: '/home/usuario/Proyectos/limpieza_temporales.py',
    isDir: false,
    size: 890,
    modifiedAt: '2026-10-05 18:22',
    extension: 'py',
    formatCategory: 'code',
    content: `#!/usr/bin/env python3
import os, glob, shutil

print("🧹 Iniciando protocolo de mantenimiento y optimización...")
temp_paths = ['/tmp', './.cache', './build/cache']
cleaned_bytes = 0

for p in temp_paths:
    if os.path.exists(p):
        print(f"Verificando directorio: {p}")

print("✨ Sistema optimizado con éxito. Espacio recuperado simulado: 1.4 GB.")`
  },
  {
    name: 'resumen_ejecutivo_q3.md',
    path: '/home/usuario/Documentos/resumen_ejecutivo_q3.md',
    isDir: false,
    size: 2450,
    modifiedAt: '2026-10-06 08:50',
    extension: 'md',
    formatCategory: 'code',
    content: `# INFORME EJECUTIVO DE RENDIMIENTO & PROYECTOS - Q3 2026

## 1. Resumen de Operaciones
Durante el trimestre actual, el agente inteligente ha procesado de forma autónoma:
- **324 correos electrónicos** clasificados y gestionados sin retrasos.
- **18 tareas de automatización de sistema** ejecutadas en servidor local.
- **4 proyectos integrales de software** entregados con especificaciones técnicas completas.

## 2. Hitos Alcanzados
1. **Reducción del 85%** en tiempo de respuesta a clientes corporativos.
2. **Supervisión Continua del Ordenador**: Cero caídas no planificadas de servicios locales.
3. **Despliegues Automáticos**: Integración con scripts bash y bridge multiplataforma.`
  },
  {
    name: 'api_server.py',
    path: '/home/usuario/Proyectos/api_server.py',
    isDir: false,
    size: 1320,
    modifiedAt: '2026-10-05 14:15',
    extension: 'py',
    formatCategory: 'code',
    content: `from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Microservicio de Tareas Autónomas", version="1.0.0")

@app.get("/")
def read_root():
    return {"status": "ok", "agent": "OmniAgent v2.5", "computerAccess": "full"}

@app.get("/tasks")
def list_tasks():
    return [
        {"id": 1, "task": "Revisar bandeja de entrada", "status": "completed"},
        {"id": 2, "task": "Compilar artefactos de código", "status": "running"}
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`
  },
  {
    name: 'Proyectos',
    path: '/home/usuario/Proyectos',
    isDir: true,
    size: 4096,
    modifiedAt: '2026-10-06 09:00',
    formatCategory: 'system'
  },
  {
    name: 'Documentos',
    path: '/home/usuario/Documentos',
    isDir: true,
    size: 4096,
    modifiedAt: '2026-10-06 09:00',
    formatCategory: 'system'
  },
  {
    name: 'Descargas',
    path: '/home/usuario/Descargas',
    isDir: true,
    size: 4096,
    modifiedAt: '2026-10-06 09:00',
    formatCategory: 'system'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Despliegue y Automatización SaaS Cloud',
    description: 'Arquitectura completa de contenedores, scripts de mantenimiento del ordenador y monitorización en tiempo real.',
    category: 'Infraestructura & DevOps',
    status: 'in_progress',
    progress: 72,
    createdAt: '2026-09-28',
    updatedAt: '2026-10-06 09:15',
    tasks: [
      { id: 't1', text: 'Configurar demonio bridge local para acceso a terminal', completed: true, priority: 'alta' },
      { id: 't2', text: 'Implementar script de monitoreo de CPU y memoria en bash', completed: true, priority: 'media' },
      { id: 't3', text: 'Crear pipeline de respaldo de archivos y documentos', completed: true, priority: 'media' },
      { id: 't4', text: 'Automatizar triaje de correos entrantes de soporte', completed: false, priority: 'alta' },
      { id: 't5', text: 'Verificar certificados SSL y puertos abiertos en firewall', completed: false, priority: 'baja' }
    ],
    deliverables: [
      {
        id: 'del-1',
        fileName: 'docker-compose.yml',
        filePath: '/home/usuario/Proyectos/docker-compose.yml',
        fileType: 'text',
        description: 'Definición de servicios de backend, base de datos y proxy inverso',
        content: `version: '3.8'
services:
  omni-agent-api:
    image: node:22-alpine
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  redis-cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"`,
        timestamp: '2026-10-04 15:30'
      },
      {
        id: 'del-2',
        fileName: 'manual_operaciones.docx',
        filePath: '/home/usuario/Documentos/manual_operaciones.docx',
        fileType: 'docx',
        description: 'Guía de comandos y protocolos de emergencia para el operador del sistema',
        content: `# Manual de Operaciones y Control del Ordenador

1. Inicio de servicios: docker compose up -d
2. Revisión de salud: curl http://localhost:3000/api/health
3. Puente local de PC: python3 omni_agent_bridge.py
4. Respaldos: Los backups se sincronizan diariamente en /home/usuario/Documentos.`,
        timestamp: '2026-10-05 11:20'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Centro de Inteligencia de Correos & CRM',
    description: 'Sistema autónomo para detección de prospectos, extracción de presupuestos y redacción instantánea de respuestas profesionales.',
    category: 'Productividad & Negocio',
    status: 'in_progress',
    progress: 88,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-06 08:30',
    tasks: [
      { id: 't201', text: 'Parser de correos con clasificación por sentimiento', completed: true, priority: 'alta' },
      { id: 't202', text: 'Generador de plantillas dinámicas según urgencia', completed: true, priority: 'alta' },
      { id: 't203', text: 'Filtro anti-spam y protección de enlaces maliciosos', completed: true, priority: 'media' },
      { id: 't204', text: 'Integración directa con cuenta Google Workspace / Gmail', completed: false, priority: 'media' }
    ],
    deliverables: [
      {
        id: 'del-201',
        fileName: 'reglas_triaje_email.json',
        filePath: '/home/usuario/Documentos/reglas_triaje_email.json',
        fileType: 'json',
        description: 'Configuración de reglas heurísticas para clasificación automática de correos',
        content: `{
  "rules": [
    { "keywords": ["urgente", "caída", "inmediato"], "priority": "alta", "autoNotify": true },
    { "keywords": ["presupuesto", "factura", "pago"], "priority": "alta", "category": "finanzas" },
    { "keywords": ["reunión", "llamada", "meet"], "priority": "media", "category": "agenda" }
  ],
  "autoDraftReply": true
}`,
        timestamp: '2026-10-05 17:00'
      }
    ]
  }
];

export const INITIAL_PROCESSES: SystemProcess[] = [
  { pid: 1402, name: 'curto-ai-core', cpu: 1.8, mem: 124.5, user: 'curto', status: 'running' },
  { pid: 1408, name: 'gemini-worker-pool', cpu: 2.4, mem: 210.0, user: 'curto', status: 'running' },
  { pid: 1520, name: 'bridge-daemon', cpu: 0.2, mem: 42.1, user: 'curto', status: 'running' },
  { pid: 882, name: 'node (vite-dev-server)', cpu: 1.1, mem: 168.3, user: 'curto', status: 'running' },
  { pid: 610, name: 'systemd / init', cpu: 0.1, mem: 18.0, user: 'root', status: 'sleeping' },
  { pid: 2190, name: 'python3 data_sync.py', cpu: 0.6, mem: 88.4, user: 'curto', status: 'running' }
];

export const SUPER_AUTOPILOT_CHAINS: SuperAutopilotChain[] = [
  {
    id: 'chain-outlook-exec',
    title: 'Super-Auditoría Outlook & Reporte C-Level',
    subtitle: 'Sincronización de Exchange, detección de urgencias y generación de .docx',
    category: 'executive',
    estimatedSeconds: 8,
    stepsCount: 5,
    iconName: 'MailCheck',
    description: 'Accede al buzón de a01425929@tec.mx, prioriza asuntos de profesores y clientes, redacta borradores automáticos y compila un reporte formal de estado en /Documentos.',
    targetFolders: ['Documentos', 'Descargas'],
    outputFiles: ['Reporte_Ejecutivo_Emails_Q4.docx', 'bitacora_respuestas.pdf'],
    pipeline: [
      { step: 'Conexión Microsoft Graph API', agentRole: 'Outlook Integrator', actionDetail: 'Autenticación con Exchange Online y lectura de 4 mensajes entrantes' },
      { step: 'Triaje Semántico & Urgencias', agentRole: 'NLP Classifier', actionDetail: 'Detección de correo Prof. Roberto Garza y asignación de prioridad ALTA' },
      { step: 'Redacción Diplomática con Plantilla', agentRole: 'Executive Copywriter', actionDetail: 'Generación de respuesta formal de proyecto para rgarza@tec.mx' },
      { step: 'Generación de Documento .docx Formal', agentRole: 'Document Factory', actionDetail: 'Exportación a /Documentos/Reporte_Ejecutivo_Emails_Q4.docx' },
      { step: 'Sincronización a Firestore Cloud', agentRole: 'Zero-Trust Guardian', actionDetail: 'Persistencia en tiempo real de estado y bitácora de auditoría' }
    ]
  },
  {
    id: 'chain-devops-selfhealing',
    title: 'Ingeniero Autónomo DevOps & Código Auto-Reparable',
    subtitle: 'Auditoría de sintaxis, test en sandbox y corrección de bugs en vivo',
    category: 'devops',
    estimatedSeconds: 12,
    stepsCount: 6,
    iconName: 'Cpu',
    description: 'Escanea el repositorio y scripts en /Proyectos, ejecuta el código en sandbox seguro, detecta trazas de error (Tracebacks) y auto-genera parches con validación de tests.',
    targetFolders: ['Proyectos'],
    outputFiles: ['api_server_v2_patched.py', 'informe_cobertura.xlsx'],
    pipeline: [
      { step: 'Inspección de AST y Sintaxis', agentRole: 'Static Analyzer', actionDetail: 'Lectura de scripts en /Proyectos/api_server.py y detección de fallo de tipos' },
      { step: 'Ejecución en Sandbox Aislado', agentRole: 'Devin-Engine', actionDetail: 'Ejecución en contenedor con medición de latencia y memoria RAM' },
      { step: 'Auto-Corrección Neuronal (Self-Healing)', agentRole: 'Auto-Debugger', actionDetail: 'Aplicación automática del parche de corrección de excepciones' },
      { step: 'Generación de Tests Unitarios', agentRole: 'QA Architect', actionDetail: 'Creación de test_suite.py con 100% de aserciones aprobadas' },
      { step: 'Exportación de Métricas .xlsx', agentRole: 'Office Factory', actionDetail: 'Guardado de informe_cobertura.xlsx en /Proyectos con fórmulas de éxito' }
    ]
  },
  {
    id: 'chain-finance-model',
    title: 'Arquitecto Financiero & Generador .xlsx',
    subtitle: 'Hoja de balance, fórmulas automáticas SUM/CAGR y proyección 2026',
    category: 'finance',
    estimatedSeconds: 7,
    stepsCount: 4,
    iconName: 'TrendingUp',
    description: 'Modela el presupuesto anual, analiza la telemetría de consumo de recursos y exporta un libro contable .xlsx con proyecciones y tablas de crecimiento a /Descargas.',
    targetFolders: ['Descargas', 'Documentos'],
    outputFiles: ['Modelo_Financiero_Proyeccion_2026.xlsx'],
    pipeline: [
      { step: 'Análisis de Datos y Variables', agentRole: 'Quant Analyst', actionDetail: 'Extracción de métricas de carga operativa y estimación de costos en la nube' },
      { step: 'Cálculo de Fórmulas y Proyecciones', agentRole: 'Financial Engine', actionDetail: 'Cálculo de TIR, VAN, CAGR y proyecciones de ahorro del 42%' },
      { step: 'Generación de Estructura Excel .xlsx', agentRole: 'Office Factory', actionDetail: 'Creación de hoja multisede con pestañas de ingresos, gastos y márgenes' },
      { step: 'Depósito Seguro en /Descargas', agentRole: 'Security Gatekeeper', actionDetail: 'Verificación de checksum SHA-256 y notificación al usuario' }
    ]
  },
  {
    id: 'chain-academic-paper',
    title: 'Deep Research Académico & Diapositivas .pptx',
    subtitle: 'Síntesis doctoral, citas científicas e informe con presentación',
    category: 'academic',
    estimatedSeconds: 10,
    stepsCount: 5,
    iconName: 'GraduationCap',
    description: 'Investiga a fondo el tema solicitado, sintetiza bibliografía en formato APA, genera un paper en .pdf y diapositivas de defensa ejecutiva en .pptx.',
    targetFolders: ['Documentos'],
    outputFiles: ['Tesis_Agentes_Autonomos_2026.pdf', 'Presentacion_Defensa.pptx'],
    pipeline: [
      { step: 'Búsqueda Profunda Multifuente', agentRole: 'Deep Researcher', actionDetail: 'Recopilación de papers de IEEE, ArXiv y estándares de la industria' },
      { step: 'Contraste y Detección de Falacias', agentRole: 'Epistemic Validator', actionDetail: 'Verificación cruzada de afirmaciones y eliminación de alucinaciones' },
      { step: 'Redacción de Paper .pdf', agentRole: 'Academic Writer', actionDetail: 'Estructuración IMRyD con resumen, metodología y conclusiones en .pdf' },
      { step: 'Diseño de Diapositivas .pptx', agentRole: 'Slide Deck Architect', actionDetail: 'Generación de 10 diapositivas estructuradas con puntos clave' },
      { step: 'Archivado en /Documentos', agentRole: 'Storage Manager', actionDetail: 'Indexación del entregable y sincronización con el historial del agente' }
    ]
  }
];

export const AI_BENCHMARK_MATRIX: AIBenchmarkComparison[] = [
  {
    feature: 'Control Real de Archivos (.docx, .xlsx, .pptx, .pdf)',
    curtosAI: '✅ Nativo total (lectura/escritura en /Documentos, /Proyectos, /Descargas)',
    chatgptO3: '❌ No (Entorno efímero aislado sin persistencia)',
    claudeSonnet: '⚠️ Parcial (Solo contenedores Docker limitados)',
    cognitionDevin: '❌ Limitado (Enfocado solo a repositorios git)',
    copilotPro: '⚠️ Solo lectura básica dentro de suite Office',
    winner: 'curtos',
    advantageNote: 'Curto\'s AI interactúa directamente con los archivos reales de tu ordenador bajo un marco de permisos estricto.'
  },
  {
    feature: 'Sincronización Outlook & Exchange (`a01425929@tec.mx`)',
    curtosAI: '✅ Nativo directo (Microsoft Graph API, triaje y respuesta con plantillas)',
    chatgptO3: '❌ No disponible',
    claudeSonnet: '❌ No disponible',
    cognitionDevin: '❌ No disponible',
    copilotPro: '⚠️ Requiere suscripción corporativa M365 E5 costosa',
    winner: 'curtos',
    advantageNote: 'Curto\'s AI clasifica, responde y genera entregables desde correos de tu cuenta institucional en segundos.'
  },
  {
    feature: 'Sandbox de Código con Auto-Reparación (Self-Healing)',
    curtosAI: '✅ Incluido (Ejecución Python/TS + Diagnóstico y parche automático)',
    chatgptO3: '⚠️ Code Interpreter básico (sin auto-corrección interactiva de proyectos)',
    claudeSonnet: '⚠️ Solo artefactos visuales',
    cognitionDevin: '✅ Sí, pero con costo prohibitivo ($500 USD/mes)',
    copilotPro: '❌ No disponible',
    winner: 'curtos',
    advantageNote: 'Curto\'s AI ejecuta, analiza el stacktrace y repara automáticamente el código defectuoso sin coste adicional.'
  },
  {
    feature: 'Telemetría de Hardware en Vivo (CPU, RAM, Procesos)',
    curtosAI: '✅ Dashboard visual interactivo con Recharts y métricas en tiempo real',
    chatgptO3: '❌ Inexistente',
    claudeSonnet: '❌ Inexistente',
    cognitionDevin: '❌ Inexistente',
    copilotPro: '❌ Inexistente',
    winner: 'curtos',
    advantageNote: 'Monitoreo de recursos y control de procesos en tu máquina física o sandbox.'
  },
  {
    feature: 'Persistencia en la Nube Zero-Cost (Firebase Firestore)',
    curtosAI: '✅ Sincronización en tiempo real de tareas, correos y proyectos',
    chatgptO3: '❌ Cerrado en servidores de OpenAI',
    claudeSonnet: '❌ Cerrado en Anthropic',
    cognitionDevin: '❌ Solo almacenamiento temporal por sesión',
    copilotPro: '⚠️ Bloqueado en tenant cerrado de Microsoft',
    winner: 'curtos',
    advantageNote: 'Tus datos son tuyos, sincronizados con tu propia base de datos Firebase aprovisionada.'
  },
  {
    feature: 'Voz Neuronal Bidireccional con Reconocimiento en Español',
    curtosAI: '✅ Entrada por micrófono + respuesta hablada con visualizador de ondas',
    chatgptO3: '⚠️ Solo en app móvil (restringido en web y sin comandos de sistema)',
    claudeSonnet: '❌ No cuenta con voz integrada',
    cognitionDevin: '❌ No cuenta con voz',
    copilotPro: '⚠️ Básico y con latencia elevada',
    winner: 'curtos',
    advantageNote: 'Habla directamente con Curto\'s AI y escucha sus respuestas mientras ejecuta órdenes en tu sistema.'
  },
  {
    feature: 'Cadenas de Automatización Multi-Agente (Autopilot Chains)',
    curtosAI: '✅ 1 Clic para ejecutar secuencias complejas de 5-6 roles coordinados',
    chatgptO3: '❌ Requiere prompts manuales sucesivos',
    claudeSonnet: '❌ Requiere interacción paso a paso',
    cognitionDevin: '⚠️ Solo orientado a terminal/código',
    copilotPro: '❌ Inexistente',
    winner: 'curtos',
    advantageNote: 'Curto\'s AI orquesta múltiples agentes especializados en paralelo para entregar resultados terminados.'
  }
];

export const DEFAULT_CODE_SANDBOX: CodeSandboxSession = {
  id: 'session-demo-01',
  language: 'python',
  code: `import math
import time

def calcular_rendimiento_sistema(nucleos, ram_gb, tareas):
    """
    Función que calcula el índice de rendimiento de Curto's AI
    frente a sistemas convencionales de IA.
    """
    print("🚀 Iniciando prueba de estrés y benchmark de Curto's AI...")
    
    # Simulación de cálculo de rendimiento
    indice_base = (nucleos * 1.5) + (ram_gb * 0.8)
    eficiencia = 1.0
    
    for tarea in tareas:
        print(f"  [+] Procesando tarea: {tarea['nombre']} ({tarea['prioridad']})")
        eficiencia += 0.25
    
    score = indice_base * eficiencia * math.pi
    return round(score, 2)

# Datos de la máquina
nucleos = 8
ram_gb = 16.0
tareas = [
    {"nombre": "Sincronización Outlook (a01425929@tec.mx)", "prioridad": "ALTA"},
    {"nombre": "Generación de informe .docx para Prof. Garza", "prioridad": "ALTA"},
    {"nombre": "Optimización de memoria en /Documentos", "prioridad": "MEDIA"}
]

resultado = calcular_rendimiento_sistema(nucleos, ram_gb, tareas)
print(f"\\n✅ SCORE DE POTENCIA DE CURTO'S AI: {resultado} PUNTOS (99.8% Superior al mercado)")
`,
  output: `🚀 Iniciando prueba de estrés y benchmark de Curto's AI...
  [+] Procesando tarea: Sincronización Outlook (a01425929@tec.mx) (ALTA)
  [+] Procesando tarea: Generación de informe .docx para Prof. Garza (ALTA)
  [+] Procesando tarea: Optimización de memoria en /Documentos (MEDIA)

✅ SCORE DE POTENCIA DE CURTO'S AI: 136.35 PUNTOS (99.8% Superior al mercado)`,
  executionTimeMs: 42,
  memoryUsageMb: 14.8,
  isRunning: false
};

export const INITIAL_CONVERSATIONS: ConversationSession[] = [
  {
    id: 'conv-outlook-sync',
    title: 'Sincronización de Outlook y entrega Tec de Monterrey',
    createdAt: 'Hoy, 09:44 AM',
    updatedAt: 'Hoy, 09:45 AM',
    pinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: '¿Qué correos urgentes tengo en mi cuenta de Outlook institucional (a01425929@tec.mx) y qué debo entregar hoy?',
        timestamp: '09:44:12'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `Hola. He analizado en tiempo real tu bandeja de entrada de Microsoft Outlook (Exchange Online) vinculada a tu matrícula institucional **a01425929@tec.mx**.

### 📬 Resumen de correos urgentes detectados:
1. **Prof. Roberto Garza (Director de Depto. de Computación)**:
   - **Asunto**: *URGENTE [Proyecto Integrador]: Entrega final de Agentes Autónomos y Repositorio*
   - **Prioridad**: **ALTA** (Fecha límite hoy a las 23:59).
   - **Requisitos de entrega**:
     - Informe técnico formal en formato \`.docx\` o \`.pdf\` en la carpeta \`/Documentos\`.
     - Scripts de prueba en Python y verificación en terminal en \`/Proyectos\`.
     - Confirmación de políticas de seguridad en carpetas autorizadas.
2. **Sofía Villarreal (Líder Técnica)**:
   - **Asunto**: *Avance del Sprint: Métricas de rendimiento y scripts de validación*
   - **Prioridad**: **ALTA**. Solicitó revisión de métricas y validación del modelo.

### 🛡️ Acciones que ya ejecuté automáticamente:
- Redacté un borrador de respuesta diplomático y técnico para el Prof. Roberto Garza confirmando que los entregables están listos.
- Verifiqué que el archivo \`/home/usuario/Documentos/propuesta_comercial_q4.docx\` cumple con la estructura requerida.
- Los scripts en \`/home/usuario/Proyectos/api_server.py\` pasaron las pruebas unitarias.`,
        timestamp: '09:44:18',
        roleActive: "Curto's Outlook & Executive Director",
        thoughtProcess: "Analizando solicitudes del usuario sobre el buzón a01425929@tec.mx. Identificando correos no leídos con etiqueta URGENTE. Comprobando estado de entregables en /Documentos y redactando respuesta institucional de alta cortesía.",
        suggestedNextOrders: [
          'Enviar la respuesta redactada al Prof. Roberto Garza',
          'Generar informe final de Agentes Autónomos en .docx',
          'Abrir la pestaña de Correos para revisar los 4 mensajes'
        ]
      }
    ]
  },
  {
    id: 'conv-general-qa',
    title: 'Superinteligencia y Capacidades de Curto\'s AI',
    createdAt: 'Hoy, 09:20 AM',
    updatedAt: 'Hoy, 09:25 AM',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: '¿Quién eres y en qué te diferencias de ChatGPT o Claude?',
        timestamp: '09:20:00'
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Soy **Curto's AI**, una superinteligencia artificial ejecutiva y autónoma diseñada para ir más allá de los chatbots de texto convencionales.

### 🚀 ¿Por qué Curto's AI supera a otros modelos?

| Capacidad | Curto's AI | ChatGPT (o3 / GPT-4o) | Claude (3.7 Sonnet) |
| :--- | :--- | :--- | :--- |
| **Acceso real a archivos** | ✅ Lee/escribe en \`/Documentos\`, \`/Proyectos\`, \`/Descargas\` | ❌ Aislado en nube sin acceso local | ❌ Sin acceso a tu disco local |
| **Integración con Outlook** | ✅ Microsoft Graph API directo con \`a01425929@tec.mx\` | ❌ Solo mediante plugins de terceros | ❌ Inexistente nativamente |
| **Sandbox de Código Devin** | ✅ Ejecución interactiva y auto-reparación (Self-Healing) | ⚠️ Intérprete efímero limitado | ⚠️ Solo renderizado de artefactos |
| **Fábrica de Documentos** | ✅ Genera \`.docx\`, \`.xlsx\`, \`.pdf\`, \`.pptx\` reales descargables | ⚠️ Solo texto markdown plano | ⚠️ Solo texto |
| **Historial Multisesión** | ✅ Persistencia instantánea en Firebase Firestore y memoria local | ⚠️ Almacenamiento cerrado | ⚠️ Almacenamiento cerrado |
| **Cadenas Autopilot** | ✅ Orquesta 5 a 6 agentes en un solo clic | ❌ Requiere prompts manuales | ❌ Requiere prompts manuales |

Puedes hacerme **cualquier pregunta** del mundo (ciencia, filosofía, programación, negocios, redacción de ensayos, matemáticas o análisis) y además ordenarme tareas ejecutivas en tu ordenador.`,
        timestamp: '09:20:08',
        roleActive: "Curto's OmniCore Superintelligence",
        thoughtProcess: "Explicación comparativa exhaustiva destacando ventajas funcionales, acceso a sistema de archivos, sincronización de correo empresarial/académico, y motor de auto-curación.",
        suggestedNextOrders: [
          'Escribe un script en Python para optimizar análisis de datos',
          'Explícame la teoría de la relatividad general de forma intuitiva',
          'Ejecuta un diagnóstico de memoria y CPU de mi sistema'
        ]
      }
    ]
  },
  {
    id: 'conv-code-devin',
    title: 'Desarrollo de Algoritmos y Auto-Reparación',
    createdAt: 'Ayer, 18:30 PM',
    updatedAt: 'Ayer, 18:35 PM',
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: '¿Cómo funciona el motor de Self-Healing para código defectuoso?',
        timestamp: '18:30:10'
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: `El motor **Self-Healing (Auto-reparación)** de Curto's AI opera mediante un ciclo continuo de retroalimentación de ejecución:

\`\`\`
[Código del Usuario] ➔ [Ejecución en Sandbox] ➔ [Detección de Traceback / Bug]
                                                         │
[Código Corregido en Producción] 🠔 [Parchado Automático] 🠔 [Análisis Causal AST]
\`\`\`

1. **Captura de Excepción**: Intercepta \`ZeroDivisionError\`, \`KeyError\`, \`TypeError\` o bugs lógicos.
2. **Inspección de Contexto**: Identifica la línea exacta, variables en memoria y el tipo de fallo.
3. **Generación del Parche**: Reescribe la porción afectada introduciendo guardas de seguridad, tipado estricto y manejo de errores.
4. **Verificación**: Reejecuta el script en el Sandbox Devin y valida que el código retorne el resultado esperado.

¿Te gustaría que reparemos algún código o script ahora mismo? Puedes probarlo en la pestaña **Devin Sandbox** o pegarme el fragmento aquí.`,
        timestamp: '18:30:25',
        roleActive: "Curto's Devin Code Architect",
        suggestedNextOrders: [
          'Ir al Sandbox Devin para probar la auto-reparación',
          'Crear un servidor FastAPI con autenticación JWT',
          'Optimizar una consulta SQL compleja'
        ]
      }
    ]
  }
];

