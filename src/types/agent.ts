export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  priority: 'alta' | 'media' | 'baja';
  category: 'trabajo' | 'cliente' | 'factura' | 'proyecto' | 'personal' | 'urgente';
  draftReply?: string;
  replySent?: boolean;
  matchedRuleId?: string;
  usedTemplateId?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  templateText: string;
  tone: 'formal' | 'conciso' | 'comercial' | 'tecnico' | 'urgente';
}

export interface EmailClassificationRule {
  id: string;
  name: string;
  conditionType: 'sender_contains' | 'subject_contains' | 'has_attachment' | 'priority_high';
  value: string;
  assignedCategory: 'trabajo' | 'cliente' | 'factura' | 'proyecto' | 'personal' | 'urgente';
  assignedTemplateId?: string;
  autoDraftReply: boolean;
}

export interface EmailAccountConfig {
  provider: 'gmail' | 'outlook' | 'imap' | 'sandbox';
  accountEmail: string;
  connected: boolean;
  userName?: string;
  lastSync?: string;
}

export interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  category: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  agentExecutionResult?: string;
  deliverableId?: string;
  outputLog?: string;
}

export interface FolderPermission {
  id: string;
  name: string; // 'Documentos', 'Proyectos', 'Descargas', etc.
  virtualPath: string;
  realPathHint: string;
  canRead: boolean;
  canWrite: boolean;
  canExecute: boolean;
  enabled: boolean;
  description: string;
}

export interface FileTypePermission {
  extension: string; // '.docx', '.pdf', '.pptx', '.xlsx', etc.
  name: string;
  category: 'office' | 'code' | 'data' | 'system';
  canRead: boolean;
  canWrite: boolean;
  description: string;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: 'READ' | 'WRITE' | 'EXECUTE' | 'BLOCKED';
  targetPath: string;
  fileExtension?: string;
  status: 'ALLOW' | 'DENY';
  reason: string;
}

export interface SecurityPolicy {
  strictFolderIsolation: boolean;
  blockSystemDirectories: boolean;
  requireConfirmationOnWrite: boolean;
  allowedFolders: FolderPermission[];
  allowedFileTypes: FileTypePermission[];
  auditLog: SecurityAuditEntry[];
}

export interface ProjectDeliverable {
  id: string;
  fileName: string;
  filePath: string;
  fileType: 'markdown' | 'typescript' | 'python' | 'html' | 'json' | 'bash' | 'text' | 'docx' | 'xlsx' | 'pdf';
  description: string;
  content: string;
  timestamp: string;
}

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
  priority: 'alta' | 'media' | 'baja';
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'planning' | 'in_progress' | 'completed';
  progress: number;
  tasks: ProjectTask[];
  deliverables: ProjectDeliverable[];
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  content?: string;
  modifiedAt: string;
  extension?: string;
  formatCategory?: 'office' | 'code' | 'data' | 'archive' | 'system';
}

export interface AgentActionStep {
  title: string;
  category: 'email' | 'terminal' | 'filesystem' | 'project' | 'system' | 'report' | 'security';
  actionType: string;
  commandOrPayload?: string;
  targetPath?: string;
  content?: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
}

export interface AgentExecution {
  id: string;
  prompt: string;
  timestamp: string;
  thoughtProcess: string;
  roleActive: string;
  summary: string;
  steps: AgentActionStep[];
  terminalOutput: string;
  deliverables?: ProjectDeliverable[];
  emailActions?: Array<{
    emailId?: string;
    action: string;
    recipient?: string;
    subject: string;
    draftReply?: string;
    priority?: string;
  }>;
  suggestedNextOrders?: string[];
}

export interface LocalBridgeStatus {
  isConnected: boolean;
  os?: string;
  release?: string;
  node?: string;
  machine?: string;
  user?: string;
  cwd?: string;
  cpus?: number;
  freeMem?: string;
  totalMem?: string;
  lastPing?: string;
  checking: boolean;
  error?: string;
  securityEnforced?: boolean;
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  user: string;
  status: 'running' | 'sleeping';
}

export type CognitiveEngineMode = 
  | 'deep_research' 
  | 'devin_code' 
  | 'doc_factory' 
  | 'voice_operator' 
  | 'web_browser' 
  | 'zero_trust_security';

export interface SuperAutopilotChain {
  id: string;
  title: string;
  subtitle: string;
  category: 'executive' | 'devops' | 'finance' | 'academic';
  estimatedSeconds: number;
  stepsCount: number;
  iconName: string;
  description: string;
  targetFolders: string[];
  outputFiles: string[];
  pipeline: Array<{
    step: string;
    agentRole: string;
    actionDetail: string;
  }>;
}

export interface CodeSandboxSession {
  id: string;
  language: 'python' | 'typescript' | 'javascript' | 'sql' | 'bash';
  code: string;
  output: string;
  error?: string;
  executionTimeMs?: number;
  memoryUsageMb?: number;
  isRunning: boolean;
  fixedCode?: string;
  autoFixExplanation?: string;
}

export interface AIBenchmarkComparison {
  feature: string;
  curtosAI: string;
  chatgptO3: string;
  claudeSonnet: string;
  cognitionDevin: string;
  copilotPro: string;
  winner: 'curtos';
  advantageNote: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // Text content or data URL for binaries/images
  isImage?: boolean;
  category?: 'document' | 'code' | 'image' | 'data' | 'audio' | 'archive' | 'other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  thoughtProcess?: string;
  roleActive?: string;
  steps?: AgentActionStep[];
  deliverables?: ProjectDeliverable[];
  emailActions?: Array<{
    emailId?: string;
    action: string;
    recipient?: string;
    subject: string;
    draftReply?: string;
    priority?: string;
  }>;
  terminalOutput?: string;
  suggestedNextOrders?: string[];
  cognitiveEngine?: CognitiveEngineMode;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

