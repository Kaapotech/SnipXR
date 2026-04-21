import TemplatePicker from '@/components/TemplatePicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[60%] h-[60%] bg-brand-yellow/10 blur-[120px] rounded-full" />
      </div>

      <Navbar />
      <div className="flex-grow flex flex-col justify-center relative z-10">
        <TemplatePicker />
      </div>
      <Footer />
    </main>
  );
}
