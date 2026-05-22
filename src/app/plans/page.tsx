'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Lightning, Crown, Sparkle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  '15 link-uri scurtate / lună',
  '5 descărcări QR / lună',
  'Statistici de bază (click-uri)',
  'Redirecționare instantanee',
];

const PRO_FEATURES = [
  'Link-uri nelimitate / lună',
  'Descărcări QR nelimitate',
  'Statistici avansate (țară, browser, dispozitiv)',
  'Acces la Templates',
  'Dashboard complet',
  'Suport prioritar',
];

export default function PlansPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkle size={16} weight="fill" className="text-brand-yellow" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Alege planul tău</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
              Simplu și{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-yellow">
                transparent
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Începe gratuit. Fă upgrade când ai nevoie de mai mult.
            </p>
          </motion.div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Free Plan */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-blue/10 rounded-xl">
                  <Lightning size={22} weight="bold" className="text-brand-blue" />
                </div>
                <h2 className="text-xl font-bold text-white">Free</h2>
              </div>

              <div className="mt-4 mb-8">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-gray-500 ml-2">/ lună</span>
              </div>

              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-gray-300">
                    <Check size={18} weight="bold" className="text-brand-blue mt-0.5 shrink-0" />
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              {session ? (
                <div className="w-full py-3.5 rounded-2xl border border-white/10 text-center text-sm font-bold text-gray-400 cursor-default">
                  Planul tău curent
                </div>
              ) : (
                <Link
                  href="/register"
                  className="block w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-center text-sm font-bold text-white transition-all active:scale-95"
                >
                  Începe gratuit
                </Link>
              )}
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-dark-gray border border-brand-magenta/40 rounded-3xl p-8 shadow-2xl shadow-brand-magenta/10"
            >
              {/* Popular badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-brand-magenta to-brand-yellow text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Recomandat
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-magenta/10 rounded-xl">
                  <Crown size={22} weight="bold" className="text-brand-magenta" />
                </div>
                <h2 className="text-xl font-bold text-white">Pro</h2>
              </div>

              <div className="mt-4 mb-8">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-gray-500 ml-2">/ lună</span>
              </div>

              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-gray-300">
                    <Check size={18} weight="bold" className="text-brand-magenta mt-0.5 shrink-0" />
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={cn(
                  "w-full py-3.5 rounded-2xl font-bold text-sm transition-all",
                  "bg-gradient-to-r from-brand-magenta to-brand-yellow text-white opacity-60 cursor-not-allowed"
                )}
              >
                Coming Soon
              </button>
              <p className="text-center text-xs text-gray-600 mt-3">
                Plățile vor fi disponibile în curând
              </p>
            </motion.div>
          </div>

          {/* FAQ / note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-gray-600 text-sm mt-12"
          >
            Ai întrebări? Scrie-ne la{' '}
            <span className="text-gray-400">contact@snipxr.com</span>
          </motion.p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
