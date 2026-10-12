import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Email, PendingTask, Project, SecurityPolicy } from '../types/agent';

const app = initializeApp(firebaseConfig);
/* CRITICAL: The app will break without this line */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: client is offline.");
      return false;
    }
    // Any other response (like permission-denied because /test/connection isn't allowed) proves online connectivity to Firestore
    return true;
  }
}

// User Profile helpers
export async function syncUserProfile(user: User, outlookEmail?: string) {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Usuario OmniAgent',
      outlookEmail: outlookEmail || 'a01425929@tec.mx',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// Tasks Firestore sync helpers
export async function saveTaskToFirestore(userId: string, task: PendingTask) {
  const path = `users/${userId}/tasks/${task.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'tasks', task.id), {
      id: task.id,
      userId,
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category || 'General',
      completed: task.completed,
      createdAt: task.createdAt,
      completedAt: task.completedAt || '',
      agentExecutionResult: task.agentExecutionResult || '',
      outputLog: task.outputLog || '',
      deliverableId: task.deliverableId || ''
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTaskInFirestore(userId: string, taskId: string, updates: Partial<PendingTask>) {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    await updateDoc(doc(db, 'users', userId, 'tasks', taskId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTaskFromFirestore(userId: string, taskId: string) {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Emails Firestore sync helpers
export async function saveEmailToFirestore(userId: string, email: Email) {
  const path = `users/${userId}/emails/${email.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'emails', email.id), {
      id: email.id,
      userId,
      sender: email.sender,
      senderEmail: email.senderEmail,
      subject: email.subject,
      snippet: email.snippet,
      body: email.body,
      date: email.date,
      read: email.read,
      starred: !!email.starred,
      priority: email.priority,
      category: email.category,
      draftReply: email.draftReply || '',
      replySent: !!email.replySent,
      matchedRuleId: email.matchedRuleId || '',
      usedTemplateId: email.usedTemplateId || ''
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateEmailInFirestore(userId: string, emailId: string, updates: Partial<Email>) {
  const path = `users/${userId}/emails/${emailId}`;
  try {
    await updateDoc(doc(db, 'users', userId, 'emails', emailId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Projects Firestore sync
export async function saveProjectToFirestore(userId: string, project: Project) {
  const path = `users/${userId}/projects/${project.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'projects', project.id), {
      id: project.id,
      userId,
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      progress: project.progress,
      tasks: project.tasks || [],
      deliverables: project.deliverables || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
