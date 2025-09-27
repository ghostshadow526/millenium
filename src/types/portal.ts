// Central type definitions for Millenium portal transplant
// These types consolidate shapes used across data layer, context, and pages.

export type TermKey = 'term1' | 'term2' | 'term3';

export interface FeeStatus { term1: boolean; term2: boolean; term3: boolean; }

export interface StudentInput {
  firstName: string;
  lastName: string;
  classLevel: string;
  parentEmail?: string;
  subjects?: string[];
  photoFile?: File; // only on client when creating/updating
}

export interface StudentRecord extends Omit<StudentInput, 'photoFile'> {
  id: string;
  photoUrl?: string;
  feeStatus: FeeStatus;
  createdAt: number; // epoch ms
  deleted?: boolean; // soft delete flag
}

export interface AttendanceMonthDoc { // Firestore subdoc shape
  days: Record<string, boolean>; // 'YYYY-MM-DD' -> present
}
export type AttendanceMap = Record<string, boolean>;

export interface SubjectGrade { name: string; grade: string; }
export interface ResultsDoc {
  subjects: SubjectGrade[];
  updatedAt: number;
}

export type Role = 'parent' | 'teacher' | 'admin';
export interface RoleInfo { role: Role; studentId?: string; classLevels?: string[]; }

export interface PaginatedStudents {
  students: StudentRecord[];
  cursor: any | null; // Firestore last doc snapshot (opaque)
}

export interface AddStudentResult {
  student: StudentRecord;
  qrDataUrl: string; // Data URL of QR code pointing to /id/[studentId]
  password: string;  // Provided to parent (matches student.id concept)
}

export interface SearchOptions {
  term: string;
  classLevelsFilter?: string[]; // optional teacher filter
}

export interface ParentInviteDoc {
  studentId: string;
  parentEmail?: string | null;
  parentName?: string | null;
  createdAt: number;
}

export const LOCAL_KEYS = {
  pendingRole: 'pendingRole',
  parentSession: 'parentSession',
  overrideAdmin: 'overrideAdmin'
} as const;
export type LocalStorageKey = typeof LOCAL_KEYS[keyof typeof LOCAL_KEYS];
