import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';
import { prisma } from '@/lib/prisma';
import { Notice } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

interface EditNoticeProps {
  notice: Notice | null;
  error?: string;
}

export default function EditNotice({ notice, error }: EditNoticeProps) {
  const router = useRouter();

  // Handle fallback if data is still being fetched (though SSR should block until ready)
  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex justify-center py-24 text-indigo-600">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !notice) {
    return (
      <Layout title="Error | Notice Board">
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-red-50 text-red-700 p-8 rounded-3xl text-center border border-red-200 shadow-sm">
            <h1 className="font-bold text-2xl mb-3">Notice Not Found</h1>
            <p className="mb-6">{error || "The notice you're trying to edit doesn't exist."}</p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl transition-colors font-semibold focus:ring-2 focus:ring-red-400"
            >
              Return Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit: ${notice.title} | Notice Board`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Edit Notice
            </h1>
            <p className="text-slate-600">
              Update the details of your announcement.
            </p>
          </div>
        </div>
        
        <NoticeForm initialData={notice} />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      return {
        props: {
          notice: null,
          error: 'Notice not found in the database.',
        },
      };
    }

    // Convert dates to strings for Next.js serialization
    const serializedNotice = {
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    };

    return {
      props: {
        notice: serializedNotice,
      },
    };
  } catch (error) {
    console.error('Failed to fetch notice for edit:', error);
    return {
      props: {
        notice: null,
        error: 'Failed to load the notice due to an internal error.',
      },
    };
  }
};
