import TemplatePicker from '@/components/TemplatePicker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-20">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center">
        <TemplatePicker />
      </div>
      <Footer />
    </main>
  );
}
