import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NoticeFormValues, noticeSchema } from '@/lib/schemas';
import { Notice } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

interface NoticeFormProps {
  initialData?: Notice;
}

export default function NoticeForm({ initialData }: NoticeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          body: initialData.body,
          category: initialData.category,
          priority: initialData.priority,
          publishDate: new Date(initialData.publishDate).toISOString().split('T')[0], // Format for date input
          image: initialData.image || '',
        }
      : {
          category: 'General',
          priority: 'Normal',
          publishDate: new Date().toISOString().split('T')[0],
        },
  });

  const onSubmit = async (data: NoticeFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const url = initialData ? `/api/notices/${initialData.id}` : '/api/notices';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Convert date string back to Date object for API
          publishDate: new Date(data.publishDate).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register('title')}
            className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
            }`}
            placeholder="E.g., Final Exams Schedule"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              {...register('category')}
              className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                errors.category ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
              }`}
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                errors.priority ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
              }`}
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
          </div>
        </div>

        {/* Publish Date & Image URL Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="publishDate" className="block text-sm font-semibold text-slate-700 mb-1">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              id="publishDate"
              type="date"
              {...register('publishDate')}
              className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                errors.publishDate ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
              }`}
            />
            {errors.publishDate && <p className="mt-1 text-sm text-red-600">{errors.publishDate.message as string}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              id="image"
              type="url"
              {...register('image')}
              className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                errors.image ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-semibold text-slate-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            rows={6}
            {...register('body')}
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none resize-y ${
              errors.body ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 focus:bg-white'
            }`}
            placeholder="Write the full notice details here..."
          ></textarea>
          {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Update Notice' : 'Publish Notice'}
        </button>
      </div>
    </form>
  );
}
