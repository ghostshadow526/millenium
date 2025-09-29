"use client";
import Protected from '@/components/Protected';
import Library from '@/components/Library';

export default function ParentLibraryPage(){
  return (
    <Protected allowed={['parent','admin','teacher']}>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Digital Library</h1>
          <p className="text-sm text-gray-500">Browse and read books your student can also access.</p>
        </div>
        <Library />
      </div>
    </Protected>
  );
}
