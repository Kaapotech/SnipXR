import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
