"use client";
import { useState, useEffect } from 'react';
import { listStudents } from '@/lib/studentService';
import Link from 'next/link';
import Protected from '@/components/portal/Protected';

export default function TeacherStudentsPage(){
  return (
    <Protected allowed={['teacher','admin']}> <StudentsList /> </Protected>
  );
}

function StudentsList(){
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  async function load(initial=false){
    if (loading) return; setLoading(true);
    const page = await listStudents(30, initial? undefined : cursor || undefined);
    setItems(prev => initial ? page.students : [...prev, ...page.students]);
    setCursor(page.cursor);
    setLoading(false);
  }
  useEffect(()=>{ load(true); }, []);

  const filtered = filter.trim() ? items.filter(s => {
    const term = filter.toLowerCase();
    return s.id.toLowerCase().includes(term) || (s.firstName+" "+s.lastName).toLowerCase().includes(term) || (s.classLevel||'').toLowerCase().includes(term);
  }) : items;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <h1 className="text-2xl font-semibold text-white">Students</h1>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search id, name, class" className="px-3 py-2 rounded bg-black/40 border border-white/10 text-white w-full md:w-72" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => (
          <Link key={s.id} href={`/teacher/students/${s.id}`} className="block bg-black/40 border border-white/10 rounded-lg p-4 hover:border-white/30 transition">
            <div className="flex items-center gap-3">
              {s.photoUrl && <img src={s.photoUrl} className="w-12 h-12 object-cover rounded" />}
              <div>
                <p className="text-white font-medium text-sm">{s.firstName} {s.lastName}</p>
                <p className="text-white/60 text-xs">{s.id}</p>
                <p className="text-white/40 text-[11px]">{s.classLevel}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="pt-2">
        {cursor && <button disabled={loading} onClick={()=>load()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded">{loading? 'Loading...' : 'Load more'}</button>}
      </div>
    </div>
  );
}
