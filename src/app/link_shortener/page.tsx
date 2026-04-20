import ShortenForm from '@/components/ShortenForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LinkShortenerPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col pt-20">
      <Navbar />
      <div className="flex-grow flex flex-col justify-center">
        <ShortenForm />
      </div>
      <Footer />
    </main>
  );
}
