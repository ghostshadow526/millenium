"use client";
import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import { addStudent, searchStudents, fetchStudent, fetchStudentsPage } from '@/lib/data';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Page(){
	return (
		<Protected allowed={["admin"]}>
			<AdminDashboard />
		</Protected>
	);
}

function AdminDashboard() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [classLevel, setClassLevel] = useState('JSS1');
	const [parentEmail, setParentEmail] = useState('');
	const [subjects, setSubjects] = useState('Mathematics, English');
	const [photoFile, setPhotoFile] = useState<File | undefined>();
	const [loading, setLoading] = useState(false);
	const [resultMsg, setResultMsg] = useState<string | null>(null);
	const [qr, setQr] = useState<string | null>(null);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
	const [studentId, setStudentId] = useState<string | null>(null);
	const [createParentAccount, setCreateParentAccount] = useState(true);
	const [parentName, setParentName] = useState('');
	// Teacher create
	const [tEmail, setTEmail] = useState('');
	const [tPassword, setTPassword] = useState('');
	const [tClasses, setTClasses] = useState('JSS1,JSS2');
	const [tMsg, setTMsg] = useState<string | null>(null);
	// Student list/edit
	const [studentSearch, setStudentSearch] = useState('');
	const [studentResults, setStudentResults] = useState<any[]>([]);
	const [editId, setEditId] = useState<string | null>(null);
	const [editFirst, setEditFirst] = useState('');
	const [editLast, setEditLast] = useState('');
	const [editClass, setEditClass] = useState('');
	const [editMsg, setEditMsg] = useState<string | null>(null);
	const [pageCursor, setPageCursor] = useState<any>(null);

	async function loadInitialPage() {
		const { students, cursor } = await fetchStudentsPage(10);
		setStudentResults(students); setPageCursor(cursor);
	}
	async function loadMore() {
		if(!pageCursor) return;
		const { students, cursor } = await fetchStudentsPage(10, pageCursor);
		setStudentResults(prev=>[...prev, ...students]); setPageCursor(cursor);
	}

    async function loadSearch() {
        if (!studentSearch.trim()) { setStudentResults([]); return; }
        const res = await searchStudents(studentSearch.trim());
        setStudentResults(res);
    }

<<<<<<< HEAD
    async function openEdit(id:string) {
        const data = await fetchStudent(id);
        if (!data) return;
        setEditId(id); setEditFirst(data.firstName); setEditLast(data.lastName); setEditClass(data.classLevel); setEditMsg(null);
    }

    async function saveEdit(e:React.FormEvent) {
        e.preventDefault(); if(!editId) return;
        try {
            await setDoc(doc(db,'students', editId), { firstName: editFirst, lastName: editLast, classLevel: editClass }, { merge:true });
            setEditMsg('Updated');
            await loadSearch();
            setTimeout(()=>setEditMsg(null), 1500);
        } catch(err:any) { setEditMsg(err.message); }
    }

    async function deleteStudent(id:string) {
        if (typeof window !== 'undefined' && !confirm('Delete student permanently?')) return;
        try {
            await setDoc(doc(db,'students', id), { deleted: true }, { merge:true });
            setStudentResults(r=>r.filter(s=>s.id!==id));
        } catch(err){ console.error(err); }
    }

    async function createTeacher(e: React.FormEvent) {
        e.preventDefault(); setTMsg(null);
        try {
            const cred = await createUserWithEmailAndPassword(auth, tEmail.trim(), tPassword);
            await setDoc(doc(db,'users', cred.user.uid), { role:'teacher', classLevels: tClasses.split(',').map(c=>c.trim()).filter(Boolean) }, { merge:true });
            setTMsg('Teacher account created');
            setTEmail(''); setTPassword('');
        } catch(err:any) {
            setTMsg(err.message);
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setResultMsg(null);
        try {
            const res = await addStudent({ firstName, lastName, classLevel, parentEmail: parentEmail || undefined, subjects: subjects.split(',').map(s=>s.trim()).filter(Boolean), photoFile });
            setQr(res.qrDataUrl);
            setGeneratedPassword(res.password);
            setStudentId(res.student.id);
            if (createParentAccount) {
                try { await setDoc(doc(db,'parentInvites', res.student.id), { studentId: res.student.id, parentEmail: parentEmail || null, parentName: parentName || null, createdAt: Date.now() }); } catch {}
            }
            setResultMsg('Student created successfully. Share ID/password with parent.');
            setFirstName(''); setLastName(''); setParentEmail(''); setSubjects('Mathematics, English'); setPhotoFile(undefined); setParentName('');
        } catch (err:any) { setResultMsg(err.message || 'Failed to add student'); } finally { setLoading(false); }
    };

	return (
		<div className="container mx-auto px-4 py-10 space-y-8">
			<div className="max-w-2xl bg-black/40 border border-white/10 rounded-xl p-6">
				<h2 className="text-white text-xl font-semibold mb-4">Add New Student</h2>
				<form onSubmit={submit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm text-white/80">First Name</label>
							<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
						</div>
						<div>
							<label className="text-sm text-white/80">Last Name</label>
							<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={lastName} onChange={e=>setLastName(e.target.value)} required />
						</div>
						<div>
							<label className="text-sm text-white/80">Class Level</label>
							<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={classLevel} onChange={e=>setClassLevel(e.target.value)} required />
						</div>
						<div>
							<label className="text-sm text-white/80">Parent Email (optional)</label>
							<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={parentEmail} onChange={e=>setParentEmail(e.target.value)} />
						</div>
					</div>
					<div>
						<label className="text-sm text-white/80">Subjects (comma separated)</label>
						<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={subjects} onChange={e=>setSubjects(e.target.value)} />
					</div>
					<div>
						<label className="text-sm text-white/80">Photo</label>
						<input className="w-full mt-1 text-white" type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files?.[0])} />
					</div>
					<div className="flex items-center gap-3 flex-wrap">
						<label className="inline-flex items-center gap-2 text-white/80">
							<input type="checkbox" className="accent-white" checked={createParentAccount} onChange={e=>setCreateParentAccount(e.target.checked)} /> Create Parent Invite
						</label>
						{createParentAccount && (
							<input className="px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" placeholder="Parent Name (optional)" value={parentName} onChange={e=>setParentName(e.target.value)} />
						)}
					</div>
					<button className="bg-white text-black font-semibold px-4 py-2 rounded-md" type="submit" disabled={loading}>{loading? 'Saving...' : 'Create Student'}</button>
					{resultMsg && <p className="text-white/80">{resultMsg}</p>}
				</form>
			</div>

			{qr && studentId && (
				<div className="max-w-md bg-black/40 border border-white/10 rounded-xl p-6">
					<h3 className="text-white text-lg font-semibold mb-2">Student Credentials</h3>
					<p className="text-white/80"><strong>ID / Parent Password:</strong> {studentId}</p>
					{generatedPassword && <p className="text-white/60 text-sm">Keep this safe. Use as parent portal password.</p>}
					<img src={qr} alt="QR Code" className="w-48" />
					<p className="text-white/50 text-xs">QR links to public ID card page.</p>
				</div>
			)}

			<div className="max-w-2xl bg-black/40 border border-white/10 rounded-xl p-6">
				<h2 className="text-white text-xl font-semibold mb-4">Create Teacher Account</h2>
				<form onSubmit={createTeacher} className="space-y-3">
					<div>
						<label className="text-sm text-white/80">Email</label>
						<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={tEmail} onChange={e=>setTEmail(e.target.value)} required />
					</div>
					<div>
						<label className="text-sm text-white/80">Password</label>
						<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" type="password" value={tPassword} onChange={e=>setTPassword(e.target.value)} required />
					</div>
					<div>
						<label className="text-sm text-white/80">Class Levels (comma)</label>
						<input className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={tClasses} onChange={e=>setTClasses(e.target.value)} />
					</div>
					<button className="bg-white text-black font-semibold px-4 py-2 rounded-md" type="submit">Create Teacher</button>
					{tMsg && <p className="text-white/80">{tMsg}</p>}
				</form>
			</div>

			<div className="w-full bg-black/40 border border-white/10 rounded-xl p-6">
				<h2 className="text-white text-xl font-semibold mb-4">Manage Students</h2>
				<input className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" placeholder="Search students" value={studentSearch} onChange={e=>{setStudentSearch(e.target.value)}} />
				<div className="flex gap-3 mt-4">
					<button className="bg-white text-black px-4 py-2 rounded-md" type="button" onClick={loadSearch} disabled={!studentSearch.trim()}>Search</button>
					<button className="border border-white/30 text-white px-4 py-2 rounded-md" type="button" onClick={()=>{ setStudentSearch(''); loadInitialPage(); }}>Clear</button>
					<button className="border border-white/30 text-white px-4 py-2 rounded-md" type="button" onClick={loadInitialPage}>Load First Page</button>
				</div>
				{studentResults.length>0 && (
					<div className="overflow-x-auto mt-4">
						<table className="min-w-full text-left text-white/90">
							<thead className="text-white">
								<tr>
									<th className="py-2">Photo</th>
									<th className="py-2">Name</th>
									<th className="py-2">ID</th>
									<th className="py-2">Class</th>
									<th className="py-2"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{studentResults.map(s => (
									<tr key={s.id}>
										<td className="py-2">{s.photoUrl ? <img src={s.photoUrl} alt="" className="w-10 h-10 object-cover rounded" /> : <span className="text-xs text-white/50">No Photo</span>}</td>
										<td className="py-2">{s.firstName} {s.lastName}</td>
										<td className="py-2"><span className="px-2 py-1 rounded border border-white/20 text-white/80 text-xs">{s.id}</span></td>
										<td className="py-2">{s.classLevel}</td>
										<td className="py-2 flex gap-2">
											<button className="border border-white/30 text-white px-3 py-1 rounded-md" onClick={()=>openEdit(s.id)}>Edit</button>
											<button className="border border-red-400 text-red-400 px-3 py-1 rounded-md" onClick={()=>deleteStudent(s.id)}>Delete</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				{(!studentSearch.trim()) && pageCursor && <button className="mt-4 bg-white text-black px-4 py-2 rounded-md" type="button" onClick={loadMore}>Load More</button>}
				{editId && (
					<form onSubmit={saveEdit} className="mt-6 space-y-3 p-4 rounded-lg border border-white/10 bg-white/5">
						<h3 className="text-white font-semibold">Edit Student: {editId}</h3>
						<div className="flex flex-wrap gap-4 items-start">
							<div className="w-32">
								{(() => { const st = studentResults.find(s=>s.id===editId); return st?.photoUrl ? <img src={st.photoUrl} alt="" className="w-28 h-28 object-cover rounded" /> : <div className="w-28 h-28 bg-white/10 flex items-center justify-center text-xs text-white/60 rounded">No Photo</div>; })()}
								<a href={`/id/${editId}`} target="_blank" rel="noreferrer" className="block text-xs text-white/70 mt-1">Open ID Card</a>
							</div>
							<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
								<input className="px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={editFirst} onChange={e=>setEditFirst(e.target.value)} placeholder="First Name" />
								<input className="px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={editLast} onChange={e=>setEditLast(e.target.value)} placeholder="Last Name" />
								<input className="px-3 py-2 bg-black/60 border border-white/10 rounded-md text-white" value={editClass} onChange={e=>setEditClass(e.target.value)} placeholder="Class" />
							</div>
						</div>
						<div className="flex gap-2">
							<button className="bg-white text-black px-4 py-2 rounded-md" type="submit">Save</button>
							<button type="button" className="border border-white/30 text-white px-4 py-2 rounded-md" onClick={()=>setEditId(null)}>Cancel</button>
						</div>
						{editMsg && <p className="text-white/80">{editMsg}</p>}
					</form>
				)}
			</div>
		</div>
	);
}

