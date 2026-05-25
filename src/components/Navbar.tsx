'use client';

import Link from 'next/link';
import { Lightning, List, X, User as UserIcon, SignOut, Crown, Lock } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const tabs = [
    { id: 'shorten', label: 'Link Shortener', href: '/link_shortener', color: 'hover:text-brand-blue', active: 'text-brand-blue', pro: false },
    { id: 'qr', label: 'QR Generator', href: '/qr_codes', color: 'hover:text-brand-magenta', active: 'text-brand-magenta', pro: false },
    { id: 'templates', label: 'Templates', href: '/templates', color: 'hover:text-brand-yellow', active: 'text-brand-yellow', pro: false },
  ];

  const isPro = session?.user?.plan === 'pro';

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const getActiveColor = () => {
    if (pathname === '/link_shortener') return { text: 'text-brand-blue', bg: 'bg-brand-blue', border: 'border-brand-blue/20' };
    if (pathname === '/qr_codes') return { text: 'text-brand-magenta', bg: 'bg-brand-magenta', border: 'border-brand-magenta/20' };
    if (pathname === '/templates') return { text: 'text-brand-yellow', bg: 'bg-brand-yellow', border: 'border-brand-yellow/20' };
    return { text: 'text-white', bg: 'bg-white', border: 'border-white/10' };
  };

  const activeColors = getActiveColor();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
        <Link 
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 group"
        >
          <div className={cn(
            "p-1.5 rounded-lg group-hover:rotate-12 transition-transform",
            activeColors.bg === 'bg-white' ? 'bg-white' : activeColors.bg
          )}>
            <Lightning size={20} weight="fill" className={cn(
              activeColors.bg === 'bg-white' ? 'text-black' : 'text-white'
            )} />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight transition-colors",
            activeColors.bg === 'bg-white' ? 'text-white' : activeColors.text
          )}>SnipXR</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {tabs.map((tab) => {
            const locked = tab.pro && session && !isPro;
            return (
              <div key={tab.id} className="relative group/navitem">
                <Link
                  href={locked ? '/plans' : tab.href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors",
                    pathname === tab.href ? tab.active : "text-gray-400",
                    locked ? "opacity-60" : tab.color
                  )}
                >
                  {tab.label}
                  {locked && <Lock size={11} weight="bold" className="text-gray-500" />}
                </Link>
                {locked && (
                  <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-black border border-white/10 rounded-lg text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover/navitem:opacity-100 transition-opacity z-50">
                    Requires Pro plan
                  </div>
                )}
              </div>
            );
          })}
          {session && (
            <div className="relative group/navitem">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors",
                  pathname === "/dashboard" ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/plans"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black bg-gradient-to-r from-brand-magenta to-brand-yellow text-white hover:opacity-90 transition-all active:scale-95"
              >
                <Crown size={13} weight="fill" />
                Upgrade
              </Link>
              <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <UserIcon size={16} className="text-brand-blue" />
                <span className="text-xs font-bold text-gray-300">{session.user?.name || session.user?.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 rounded-full transition-all active:scale-95"
                title="Sign Out"
              >
                <SignOut size={18} weight="bold" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all active:scale-95",
                activeColors.bg === 'bg-white' ? "bg-white hover:bg-gray-200 text-black" : `${activeColors.bg} text-white hover:opacity-90`
              )}
            >
              Login
            </Link>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {tabs.map((tab) => {
                const locked = tab.pro && session && !isPro;
                return (
                  <Link
                    key={tab.id}
                    href={locked ? '/plans' : tab.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "w-full text-left px-4 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between",
                      pathname === tab.href ? "bg-white/10 text-white" : "text-gray-400 hover:text-white",
                      locked && "opacity-60"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {tab.label}
                      {locked && <Lock size={14} weight="bold" className="text-gray-500" />}
                    </span>
                    {pathname === tab.href && <div className={cn("w-2 h-2 rounded-full", tab.active.replace('text-', 'bg-'))} />}
                  </Link>
                );
              })}

              {session && (
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between",
                    pathname === "/dashboard" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  <span>Dashboard</span>
                  {pathname === "/dashboard" && <div className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              )}

              {session ? (
                <>
                  <Link
                    href="/plans"
                    onClick={handleLinkClick}
                    className="w-full py-4 rounded-2xl font-black text-center bg-gradient-to-r from-brand-magenta to-brand-yellow text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Crown size={18} weight="fill" />
                    Upgrade Plan
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="mt-2 w-full py-4 rounded-2xl font-black text-center bg-red-500/10 text-red-500 border border-red-500/20 active:scale-95 transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  onClick={handleLinkClick}
                  className={cn(
                    "mt-2 w-full py-4 rounded-2xl font-black text-center active:scale-95 transition-all",
                    activeColors.bg === 'bg-white' ? "bg-white text-black" : `${activeColors.bg} text-white`
                  )}
                >
                  Login Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
