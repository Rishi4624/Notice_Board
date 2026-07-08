import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  return (
    <Layout title="Create Notice | Notice Board">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Publish New Notice
          </h1>
          <p className="text-slate-600">
            Fill in the details below to announce something to the campus.
          </p>
        </div>
        
        <NoticeForm />
      </div>
    </Layout>
  );
}
