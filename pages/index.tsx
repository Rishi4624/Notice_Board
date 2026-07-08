import Layout from '@/components/Layout';
import NoticeCard from '@/components/NoticeCard';
import { Notice } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Loader2, Inbox } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to fetch notices');
      const data = await res.json();
      setNotices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete notice');
      
      // Optimistic UI update
      setNotices(notices.filter(notice => notice.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Layout>
      <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Campus Notice Board
        </h1>
        <p className="text-lg text-slate-600">
          Stay updated with the latest exams, events, and general announcements.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-indigo-600">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-medium text-slate-500">Loading notices...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center border border-red-200">
          <p className="font-semibold text-lg mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchNotices}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Inbox className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No notices yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            It looks like the notice board is empty. Be the first to publish an announcement!
          </p>
          <Link 
            href="/notice/new"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Publish Notice
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {notices.map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
