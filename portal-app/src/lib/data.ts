import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, startAfter, updateDoc, where } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import QRCode from 'qrcode';
import { Student, Attendance, Grade } from '@/types';

// Legacy interfaces for backward compatibility
export interface StudentInput { firstName:string; lastName:string; classLevel:string; parentEmail?:string; subjects?:string[]; photoFile?:File; }
export interface StudentRecord extends Omit<StudentInput,'photoFile'> { id:string; photoUrl?:string; feeStatus:{term1:boolean;term2:boolean;term3:boolean}; createdAt:number; }

// Enhanced student management functions
export async function createStudent(
  studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>,
  generateQR = false
): Promise<{ student: Student; qrCode?: string }> {
  const studentRef = doc(collection(db, 'students'));
  const now = new Date();
  
  let qrCode: string | undefined;
  if (generateQR) {
    const qrUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/student-id/${studentRef.id}`;
    qrCode = await QRCode.toDataURL(qrUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#6556ff',
        light: '#ffffff'
      }
    });
  }

  const student: Student = {
    ...studentData,
    id: studentRef.id,
    qrCode,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(studentRef, student);
  return { student, qrCode };
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const snap = await getDoc(doc(db, 'students', id));
    if (!snap.exists()) return null;
    
    const data: any = snap.data();
    const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
    const unified: Student = {
      id: snap.id,
      name,
      firstName: data.firstName,
      lastName: data.lastName,
      class: data.class || data.classLevel || '',
      classLevel: data.classLevel,
      email: data.email,
      age: data.age || 0,
      rollNumber: data.rollNumber || data.id || '',
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail,
      photoUrl: data.photoUrl,
      qrCode: data.qrCode,
      registeredBy: data.registeredBy || 'admin',
      registeredByUid: data.registeredByUid || data.createdBy || '',
      feeStatus: data.feeStatus || { term1:false, term2:false, term3:false },
      createdAt: data.createdAt?.toDate? data.createdAt.toDate() : (data.createdAt? new Date(data.createdAt): new Date()),
      updatedAt: data.updatedAt?.toDate? data.updatedAt.toDate() : (data.updatedAt? new Date(data.updatedAt): new Date()),
    };
    return unified;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function getStudentsByClass(className: string): Promise<Student[]> {
  try {
    const q = query(
      collection(db, 'students'),
      where('class', '==', className),
      orderBy('name')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as Student));
  } catch (error) {
    console.error('Error fetching students by class:', error);
    return [];
  }
}

export async function searchStudentsByName(searchTerm: string): Promise<Student[]> {
  try {
    const snapshot = await getDocs(collection(db, 'students'));
    const students = snapshot.docs.map(d => {
      const data: any = d.data();
      const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
      const s: Student = {
        id: d.id,
        name,
        firstName: data.firstName,
        lastName: data.lastName,
        class: data.class || data.classLevel || '',
        classLevel: data.classLevel,
        email: data.email,
        age: data.age || 0,
        rollNumber: data.rollNumber || d.id,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
        photoUrl: data.photoUrl,
        qrCode: data.qrCode,
        registeredBy: data.registeredBy || 'admin',
        registeredByUid: data.registeredByUid || data.createdBy || '',
        feeStatus: data.feeStatus || { term1:false, term2:false, term3:false },
        createdAt: data.createdAt?.toDate? data.createdAt.toDate() : (data.createdAt? new Date(data.createdAt): new Date()),
        updatedAt: data.updatedAt?.toDate? data.updatedAt.toDate() : (data.updatedAt? new Date(data.updatedAt): new Date()),
      };
      return s;
    });

    const searchLower = searchTerm.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching students:', error);
    return [];
  }
}

export async function updateStudent(
  studentId: string, 
  updates: Partial<Omit<Student, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const patch: any = { ...updates, updatedAt: new Date() };
    if (updates.name && (!updates.firstName && !updates.lastName)) {
      const parts = updates.name.split(' ');
      if (parts.length > 1) {
        patch.firstName = parts.slice(0, -1).join(' ');
        patch.lastName = parts.slice(-1).join(' ');
      }
    }
    await updateDoc(doc(db, 'students', studentId), patch);
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

export async function markAttendance(
  studentId: string,
  date: string,
  status: 'present' | 'absent' | 'late',
  markedBy: string
): Promise<void> {
  try {
    const attendanceRef = doc(collection(db, 'attendance'));
    const attendance: Attendance = {
      id: attendanceRef.id,
      studentId,
      date,
      status,
      markedBy,
      markedAt: new Date(),
    };
    
    await setDoc(attendanceRef, attendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

export async function getStudentAttendance(
  studentId: string,
  startDate?: string,
  endDate?: string
): Promise<Attendance[]> {
  try {
    let q = query(
      collection(db, 'attendance'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    let attendance = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      markedAt: doc.data().markedAt?.toDate() || new Date(),
    } as Attendance));

    // Filter by date range if provided
    if (startDate || endDate) {
      attendance = attendance.filter(record => {
        if (startDate && record.date < startDate) return false;
        if (endDate && record.date > endDate) return false;
        return true;
      });
    }

    return attendance;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

// Legacy functions for backward compatibility
export async function generateStudentId(classLevel:string){ const rand = Math.floor(1000 + Math.random()*9000); const year = new Date().getFullYear(); return `${classLevel.replace(/\s+/g,'').toUpperCase()}-${year}-${rand}`; }

export async function addStudent(data: StudentInput){ const id = await generateStudentId(data.classLevel); let photoUrl: string | undefined; if(data.photoFile){ const file = data.photoFile; const ACCEPTED=['image/jpeg','image/jpg','image/png']; if(!ACCEPTED.includes(file.type)) throw new Error('VALIDATION_UNSUPPORTED_TYPE'); if(file.size>5*1024*1024) throw new Error('VALIDATION_FILE_TOO_LARGE'); const compressed = await imageCompression(file,{ maxSizeMB:0.25, maxWidthOrHeight:600 }); const uploadBlob: Blob = compressed instanceof Blob? compressed: new Blob([compressed]); const formData = new FormData(); formData.append('image', uploadBlob, `${id}.jpg`); const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY || 'eb795bdf868353332baf6495a1a83fa0'; const resp = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,{ method:'POST', body:formData }); const result = await resp.json(); if(!resp.ok || !result?.success) throw new Error('IMGBB_UPLOAD_FAILED'); photoUrl = result.data?.url; if(!photoUrl) throw new Error('IMGBB_NO_URL_RETURNED'); }
  const { photoFile: _omit, ...rest } = data; const student: StudentRecord = { ...rest, id, photoUrl, feeStatus:{term1:false,term2:false,term3:false}, createdAt: Date.now() }; await setDoc(doc(db,'students',id), student); const origin = typeof window !== 'undefined'? window.location.origin : ''; const qrDataUrl = await QRCode.toDataURL(`${origin}/id/${id}`); return { student, qrDataUrl, password:id }; }
export async function fetchStudent(id:string){ const snap = await getDoc(doc(db,'students',id)); return snap.exists()? (snap.data() as StudentRecord): null; }
export async function searchStudents(term:string){
  const colRef = collection(db,'students');
  const all = await getDocs(colRef);
  const lower= term.toLowerCase();
  // Attach id explicitly so admin UI can reference it
  return all.docs.map(d=> ({ ...(d.data() as StudentRecord), id: (d.data() as any).id || d.id }))
    .filter(s=> (s.firstName||'').toLowerCase().includes(lower) || (s.lastName||'').toLowerCase().includes(lower) || (s.id||'').toLowerCase().includes(lower));
}
export async function fetchStudentsPage(pageSize=10, cursor?:any){
  const colRef = collection(db,'students');
  let qRef = query(colRef, orderBy('createdAt','desc'), limit(pageSize));
  if(cursor) qRef = query(colRef, orderBy('createdAt','desc'), startAfter(cursor), limit(pageSize));
  const snap = await getDocs(qRef);
  const students = snap.docs.map(d=> ({ ...(d.data() as StudentRecord), id: (d.data() as any).id || d.id }));
  const nextCursor = snap.docs.length===pageSize? snap.docs[snap.docs.length-1] : null;
  return { students, cursor: nextCursor };
}
export async function updateFeeStatus(studentId:string, term:'term1'|'term2'|'term3', paid:boolean){ await updateDoc(doc(db,'students',studentId), { [`feeStatus.${term}`]: paid }); }
export async function setAttendance(studentId:string, dateIso:string, present:boolean){ const date = new Date(dateIso); if(isNaN(date.getTime())) throw new Error('Invalid date'); const ym = dateIso.slice(0,7); const ref = doc(db,'students',studentId,'attendance', ym); const snap = await getDoc(ref); const days = snap.exists()? (snap.data() as any).days || {} : {}; (days as any)[dateIso] = present; await setDoc(ref,{ days }, { merge:true }); }
export async function getAttendanceMonth(studentId:string, year:number, month:number){ const ym = `${year}-${String(month).padStart(2,'0')}`; const ref = doc(db,'students',studentId,'attendance', ym); const snap = await getDoc(ref); return snap.exists()? ((snap.data() as any).days || {}) : {}; }
export interface SubjectGrade{ name:string; grade:string; }
export async function setResults(studentId:string, term:string, subjects: SubjectGrade[]){ await setDoc(doc(db,'students',studentId,'results',term), { subjects, updatedAt: Date.now() }); }
export async function getResults(studentId:string, term:string){ const snap = await getDoc(doc(db,'students',studentId,'results',term)); return snap.exists()? snap.data(): null; }
