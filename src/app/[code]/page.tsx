import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Zap, AlertTriangle } from 'lucide-react';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  // 1. Fetch the long URL from your database using the code
  // const data = await db.links.findUnique({ where: { code } });
  
  // 2. Logică de simulare (mock) pentru demo:
  // În producție, dacă 'destination' nu există în DB, returnezi 404.
  const destination = null; // Simulăm un link care nu există pentru a arăta pagina de 404 custom

  if (destination) {
    redirect(destination);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="bg-dark-gray border border-white/10 p-12 rounded-3xl max-w-md w-full text-center shadow-2xl animate-fade-in">
        <div className="bg-red-500/10 p-4 rounded-2xl inline-block mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-black mb-4">Link Expired or Not Found</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The link you're looking for (<code>{code}</code>) doesn't exist or has been removed from our system.
        </p>

        <Link 
          href="/"
          className="bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4 fill-black" />
          Create your own link
        </Link>
      </div>
      
      <div className="mt-8 text-gray-600 text-sm">
        &copy; 2026 SnipXR - Premium Link Management
      </div>
    </div>
  );
}
