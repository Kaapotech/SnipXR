'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkle } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const heroRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.2
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-blue/30 flex flex-col">
      <Navbar />

      <div className="flex-grow flex flex-col justify-center pt-20" ref={heroRef}>
        <section className="py-12 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2 }}
               className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full" 
             />
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2, delay: 0.5 }}
               className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-brand-magenta/10 blur-[120px] rounded-full" 
             />
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 2, delay: 1 }}
               className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-brand-yellow/5 blur-[120px] rounded-full" 
             />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <Sparkle size={16} weight="fill" className="text-brand-yellow" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">More than just a shortener</span>
            </motion.div>
            
            <div ref={titleRef}>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                BEAUTIFUL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-magenta to-brand-yellow">
                  CONNECTIONS
                </span>
              </h1>
            </div>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The link management platform for creators. Shorten links, generate QR codes, and build micro-pages in seconds.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
            >
              <Link
                href={session ? '/link_shortener' : '/register'}
                className="bg-white text-black font-black px-10 py-5 rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95 text-lg w-full sm:w-auto justify-center"
              >
                Start Building <ArrowRight size={20} weight="bold" />
              </Link>
              <Link 
                href="/templates"
                className="bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all text-lg w-full sm:w-auto justify-center"
              >
                View Examples
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
