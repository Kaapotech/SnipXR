import QRGenerator from '@/components/QRGenerator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QRCodesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-brand-magenta/10 blur-[120px] rounded-full" />
      </div>

      <Navbar />
      <div className="flex-grow flex flex-col justify-center relative z-10">
        <QRGenerator />
      </div>
      <Footer />
    </main>
  );
}
