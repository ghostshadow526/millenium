"use client";
import Protected from '@/components/Protected';
import { useState } from 'react';
import { addStudent, searchStudents, fetchStudent, fetchStudentsPage } from '@/lib/data';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AdminPage(){
  return <Protected allowed={['admin']}><AdminDashboard/></Protected>;
}

function AdminDashboard(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classLevel, setClassLevel] = useState('JSS1');
  const [parentEmail, setParentEmail] = useState('');
  const [subjects, setSubjects] = useState('Mathematics, English');
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [tEmail, setTEmail] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tClasses, setTClasses] = useState('JSS1,JSS2');
  const [tMsg, setTMsg] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editMsg, setEditMsg] = useState<string | null>(null);
  const [pageCursor, setPageCursor] = useState<any>(null);

  async function loadInitialPage(){ const { students, cursor } = await fetchStudentsPage(10); setStudentResults(students); setPageCursor(cursor); }
  async function loadMore(){ if(!pageCursor) return; const { students, cursor } = await fetchStudentsPage(10, pageCursor); setStudentResults(prev=>[...prev, ...students]); setPageCursor(cursor); }
  async function loadSearch(){ if(!studentSearch.trim()){ setStudentResults([]); return; } const res = await searchStudents(studentSearch.trim()); setStudentResults(res); }
  async function openEdit(id:string){ const data = await fetchStudent(id); if(!data) return; setEditId(id); setEditFirst(data.firstName); setEditLast(data.lastName); setEditClass(data.classLevel); setEditMsg(null); }
  async function saveEdit(e:React.FormEvent){ e.preventDefault(); if(!editId) return; try { await setDoc(doc(db,'students',editId), { firstName:editFirst,lastName:editLast,classLevel:editClass }, { merge:true }); setEditMsg('Updated'); await loadSearch(); setTimeout(()=>setEditMsg(null),1500); } catch(err:any){ setEditMsg(err.message); } }
  async function deleteStudent(id:string){ if(typeof window!=='undefined' && !confirm('Delete student permanently?')) return; try { await setDoc(doc(db,'students',id), { deleted:true }, { merge:true }); setStudentResults(r=>r.filter(s=>s.id!==id)); } catch(err){ console.error(err); } }
  async function createTeacher(e:React.FormEvent){ e.preventDefault(); setTMsg(null); try { const cred = await createUserWithEmailAndPassword(auth, tEmail.trim(), tPassword); await setDoc(doc(db,'users',cred.user.uid), { role:'teacher', classLevels: tClasses.split(',').map(c=>c.trim()).filter(Boolean) }, { merge:true }); setTMsg('Teacher account created'); setTEmail(''); setTPassword(''); } catch(err:any){ setTMsg(err.message); } }
  async function submit(e:React.FormEvent){ e.preventDefault(); setLoading(true); setResultMsg(null); try { const res = await addStudent({ firstName,lastName,classLevel,parentEmail: parentEmail || undefined, subjects: subjects.split(',').map(s=>s.trim()).filter(Boolean), photoFile }); setQr(res.qrDataUrl); setStudentId(res.student.id); setResultMsg('Student created successfully.'); setFirstName(''); setLastName(''); setParentEmail(''); setSubjects('Mathematics, English'); setPhotoFile(undefined); } catch(err:any){ setResultMsg(err.message || 'Failed'); } finally { setLoading(false); } }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <section className="grid md:grid-cols-2 gap-8">
        <form onSubmit={submit} className="card space-y-4">
          <h2 className="text-lg font-semibold">Add Student</h2>
          <div className="grid gap-3 grid-cols-2">
            <input placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
            <input placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} required />
            <input placeholder="Class Level" value={classLevel} onChange={e=>setClassLevel(e.target.value)} required />
            <input placeholder="Parent Email (optional)" value={parentEmail} onChange={e=>setParentEmail(e.target.value)} />
          </div>
            <input placeholder="Subjects (comma separated)" value={subjects} onChange={e=>setSubjects(e.target.value)} />
            <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files?.[0])} />
          <button className="btn" type="submit" disabled={loading}>{loading? 'Saving...' : 'Create Student'}</button>
          {resultMsg && <p className="text-sm text-white/70">{resultMsg}</p>}
          {qr && studentId && (
            <div className="text-xs mt-2 space-y-2">
              <div><strong>ID:</strong> {studentId}</div>
              <img src={qr} className="w-32" />
            </div>
          )}
        </form>
        <form onSubmit={createTeacher} className="card space-y-4">
          <h2 className="text-lg font-semibold">Create Teacher</h2>
          <input placeholder="Email" value={tEmail} onChange={e=>setTEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={tPassword} onChange={e=>setTPassword(e.target.value)} required />
          <input placeholder="Class Levels (comma)" value={tClasses} onChange={e=>setTClasses(e.target.value)} />
          <button className="btn" type="submit">Create</button>
          {tMsg && <p className="text-sm text-white/70">{tMsg}</p>}
        </form>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-4">Manage Students</h2>
        <div className="flex gap-3 mb-4">
          <input placeholder="Search" value={studentSearch} onChange={e=>setStudentSearch(e.target.value)} />
          <button className="btn" type="button" onClick={loadSearch} disabled={!studentSearch.trim()}>Search</button>
          <button className="btn outline" type="button" onClick={()=>{ setStudentSearch(''); loadInitialPage(); }}>Load First Page</button>
        </div>
        {studentResults.length>0 && (
          <div className="overflow-auto">
            <table className="table">
              <thead><tr><th>Photo</th><th>Name</th><th>ID</th><th>Class</th><th></th></tr></thead>
              <tbody>
                {studentResults.map(s=>(
                  <tr key={s.id}>
                    <td>{s.photoUrl? <img src={s.photoUrl} className="w-10 h-10 object-cover rounded" /> : <span className="text-xs text-white/40">No Photo</span>}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td><span className="badge">{s.id}</span></td>
                    <td>{s.classLevel}</td>
                    <td className="flex gap-2">
                      <button className="btn outline" onClick={()=>openEdit(s.id)} type="button">Edit</button>
                      <button className="btn outline" onClick={()=>deleteStudent(s.id)} type="button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(!studentSearch.trim()) && pageCursor && <button className="btn mt-4" type="button" onClick={loadMore}>Load More</button>}
        {editId && (
          <form onSubmit={saveEdit} className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
            <h3 className="font-semibold text-sm">Edit: {editId}</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <input value={editFirst} onChange={e=>setEditFirst(e.target.value)} />
              <input value={editLast} onChange={e=>setEditLast(e.target.value)} />
              <input value={editClass} onChange={e=>setEditClass(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button className="btn" type="submit">Save</button>
              <button className="btn outline" type="button" onClick={()=>setEditId(null)}>Cancel</button>
            </div>
            {editMsg && <p className="text-xs text-white/70">{editMsg}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
