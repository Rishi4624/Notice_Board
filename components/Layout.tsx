import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { BellRing } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Notice Board' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A beautiful and responsive Notice Board application." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
              <BellRing className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Notice Board
            </span>
          </Link>
          <nav>
            <Link 
              href="/notice/new" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              + Create Notice
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Notice Board. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
