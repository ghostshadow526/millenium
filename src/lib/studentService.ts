import { db } from './firebase';
import { doc, getDoc, setDoc, getDocs, collection, query, orderBy, limit, startAfter } from 'firebase/firestore';
import type { StudentRecord } from '@/types/portal';

// Re-export fetchStudent from data for consistency
export async function getStudent(studentId: string){
  const snap = await getDoc(doc(db, 'students', studentId));
  return snap.exists() ? (snap.data() as StudentRecord) : null;
}

export interface StudentsPage { students: StudentRecord[]; cursor: any | null }
export async function listStudents(pageSize = 30, cursor?: any): Promise<StudentsPage>{
  const colRef = collection(db, 'students');
  let q = query(colRef, orderBy('createdAt', 'desc'), limit(pageSize));
  if (cursor) q = query(colRef, orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize));
  const snap = await getDocs(q);
  const students = snap.docs.map(d => d.data() as StudentRecord);
  const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;
  return { students, cursor: nextCursor };
}

export async function updateStudentFields(studentId: string, patch: Partial<StudentRecord>){
  await setDoc(doc(db, 'students', studentId), patch, { merge: true });
}

// Attendance utilities reuse subcollection structure from data.ts
export async function getAttendanceMonthMap(studentId: string, ym: string){
  const ref = doc(db, 'students', studentId, 'attendance', ym);
  const snap = await getDoc(ref);
  return snap.exists() ? ((snap.data() as any).days || {}) : {};
}

export async function setAttendanceDay(studentId: string, isoDate: string, present: boolean){
  const ym = isoDate.slice(0,7);
  const ref = doc(db, 'students', studentId, 'attendance', ym);
  const snap = await getDoc(ref);
  const days = snap.exists() ? (snap.data() as any).days || {} : {};
  days[isoDate] = present;
  await setDoc(ref, { days }, { merge: true });
}
