'use client';
import { useEffect, useState } from 'react';
import Protected from '@/components/Protected';
import Link from 'next/link';
import { searchStudentsByName } from '@/lib/data';
import type { Student } from '@/types';

export default function StudentsListWrapper(){
  return <Protected allowed={['teacher','admin']}><StudentsListPage/></Protected>;
}

function StudentsListPage(){
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    const list = await searchStudentsByName(search.trim());
    setStudents(list);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ const id = setTimeout(()=>load(), 400); return ()=>clearTimeout(id); }, [search]);

  return (
    <div className="min-h-screen bg-slateGray py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h1 className="text-2xl font-semibold text-midnight_text">All Students</h1>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or roll" className="w-full md:w-80 px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-primary" />
        </div>
        {loading && <p className="text-sm text-grey">Loading...</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {students.map(s => (
            <Link key={s.id} href={`/teacher/students/${s.id}`} className="group block bg-white rounded-lg border border-gray-200 p-4 shadow hover:border-primary transition">
              <div className="flex items-center gap-3">
                {s.photoUrl && <img src={s.photoUrl} className="w-14 h-14 object-cover rounded" />}
                <div>
                  <p className="font-medium text-midnight_text text-sm">{s.name}</p>
                  <p className="text-xs text-grey/70">{s.rollNumber}</p>
                  <p className="text-[11px] text-grey/50">{s.class}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition text-xs">
                <span className="px-2 py-1 rounded bg-primary/10 text-primary">View</span>
              </div>
            </Link>
          ))}
        </div>
        {(!loading && students.length===0) && <p className="text-sm text-grey">No students found.</p>}
      </div>
    </div>
  );
}
