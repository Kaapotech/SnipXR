'use client';

import { Layout, ArrowRight, Lock } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const templates = [
  { id: 1, name: 'Dark Minimal',     description: 'Simple, elegant on a pure black background.', preview: 'bg-[#0a0a0a]', accent: 'bg-white' },
  { id: 2, name: 'Yellow Brand',     description: 'Vibrant yellow accent on dark background.', preview: 'bg-[#111]', accent: 'bg-[#FFD600]' },
  { id: 3, name: 'Glass Frost',      description: 'Glassmorphism effect on a blue gradient.', preview: 'bg-[#1a1a2e]', accent: 'bg-blue-400' },
  { id: 4, name: 'Gradient Purple',  description: 'Bold gradient from purple to pink.', preview: 'bg-gradient-to-br from-purple-600 to-pink-500', accent: 'bg-white' },
  { id: 5, name: 'Neon Glow',        description: 'Glowing neon buttons on pure black.', preview: 'bg-black', accent: 'bg-[#00E5FF]' },
  { id: 6, name: 'Clean Light',      description: 'Clean, professional light design.', preview: 'bg-gray-100', accent: 'bg-gray-800' },
];

export default function TemplatePicker() {
  const { data: session } = useSession();
  const canCreate = true;

  return (
    <section className="py-12 px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-dark-gray rounded-3xl p-6 md:p-12 shadow-2xl border border-brand-yellow/20 transition-all hover:border-brand-yellow/40">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-12">
            <div className="p-3 bg-brand-yellow/10 rounded-2xl w-fit">
              <Layout size={32} weight="bold" className="text-brand-yellow" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Webpage Templates</h2>
              <p className="text-gray-400 text-sm md:text-base">Launch a personal page in seconds</p>
            </div>
            {canCreate && (
              <Link
                href="/templates/create"
                className="md:ml-auto flex items-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-2xl hover:bg-brand-yellow/90 transition-all active:scale-95"
              >
                Create your page <ArrowRight size={18} weight="bold" />
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {templates.slice(0, 3).map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-black/40 border border-gray-800 rounded-2xl p-6 transition-all hover:border-brand-yellow/50 hover:-translate-y-2"
              >
                <div className={`w-full h-36 rounded-xl mb-5 overflow-hidden relative ${template.preview}`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                    <div className="w-8 h-8 rounded-full bg-white/20" />
                    <div className="w-16 h-2 rounded-full bg-white/30" />
                    <div className={`w-24 h-6 rounded-lg ${template.accent} opacity-80`} />
                    <div className={`w-24 h-6 rounded-lg ${template.accent} opacity-50`} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">{template.description}</p>

                {canCreate ? (
                  <Link
                    href={`/templates/create?template=${template.id}`}
                    className="flex items-center gap-2 text-brand-yellow font-bold group-hover:gap-3 transition-all text-sm"
                  >
                    Use this template <ArrowRight size={16} weight="bold" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600 text-sm font-bold">
                    <Lock size={14} weight="bold" />
                    {session ? 'Requires Pro plan' : 'Sign in to create'}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {!canCreate && (
            <div className="mt-10 text-center">
              <Link
                href={session ? '/plans' : '/login'}
                className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-bold px-10 py-4 rounded-2xl transition-all active:scale-95"
              >
                {session ? 'Upgrade to Pro' : 'Sign in'} <ArrowRight size={18} weight="bold" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
