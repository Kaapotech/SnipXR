export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/5 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">SnipXR</span>
          <span className="text-gray-500 text-sm">© 2026 Next Generation Links.</span>
        </div>

        <div className="flex gap-8">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">API</a>
        </div>
      </div>
    </footer>
  );
}
