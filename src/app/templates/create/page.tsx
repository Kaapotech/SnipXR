import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PageEditor from '@/components/PageEditor';

export default async function CreateTemplatePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <PageEditor />
      </div>
    </main>
  );
}
