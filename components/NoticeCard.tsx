import { Notice } from '@prisma/client';
import { format } from 'date-fns';
import { CalendarDays, Edit, Trash2, AlertCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface NoticeCardProps {
  notice: Notice;
  onDelete: (id: string) => void;
}

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${notice.title}"?`)) {
      setIsDeleting(true);
      onDelete(notice.id);
    }
  };

  const isUrgent = notice.priority === 'Urgent';

  return (
    <div className={`group flex flex-col relative bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden h-full ${isUrgent ? 'border-red-200 shadow-red-50' : 'border-slate-200'}`}>
      
      {/* Urgent Badge */}
      {isUrgent && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-red-200 animate-pulse-slow">
          <AlertCircle className="w-3.5 h-3.5" />
          URGENT
        </div>
      )}

      {/* Image */}
      {notice.image && (
        <div className="h-48 relative overflow-hidden shrink-0">
          <img 
            src={notice.image} 
            alt={notice.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      {/* Content Wrapper */}
      <div className="flex flex-col flex-grow p-5 md:p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-3">
          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(new Date(notice.publishDate), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
            <Tag className="w-3.5 h-3.5" />
            {notice.category}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {notice.title}
        </h3>
        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
          {notice.body}
        </p>
      </div>

      {/* Actions (Flush with bottom edges) */}
      <div className="flex border-t border-slate-100 bg-slate-50 mt-auto shrink-0 transition-colors group-hover:bg-white">
        <Link 
          href={`/notice/${notice.id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
        <div className="w-px h-6 bg-slate-200 my-auto"></div>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 focus:outline-none"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
