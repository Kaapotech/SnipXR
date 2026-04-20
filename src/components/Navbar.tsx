'use client';

import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const tabs = [
    { id: 'shorten', label: 'Link Shortener', href: '/link_shortener', color: 'hover:text-brand-blue', active: 'text-brand-blue' },
    { id: 'qr', label: 'QR Generator', href: '/qr_codes', color: 'hover:text-brand-magenta', active: 'text-brand-magenta' },
    { id: 'templates', label: 'Templates', href: '/templates', color: 'hover:text-brand-yellow', active: 'text-brand-yellow' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link 
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 group"
        >
          <div className="bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SnipXR</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === tab.href ? tab.active : "text-gray-400",
                tab.color
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/link_shortener"
            className="hidden sm:block bg-white hover:bg-gray-200 text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all active:scale-95"
          >
            Get Started
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-6 flex flex-col gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={handleLinkClick}
              className={cn(
                "w-full text-left px-4 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between",
                pathname === tab.href ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              )}
            >
              {tab.label}
              {pathname === tab.href && <div className={cn("w-2 h-2 rounded-full", tab.active.replace('text-', 'bg-'))} />}
            </Link>
          ))}
          <Link 
            href="/link_shortener"
            onClick={handleLinkClick}
            className="mt-2 bg-white text-black w-full py-4 rounded-2xl font-black text-center active:scale-95 transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
