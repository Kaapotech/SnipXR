'use client';

import { Layout, Palette, ArrowRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const templates = [
  {
    id: 1,
    name: 'Personal Bio',
    description: 'Perfect for social media profiles and personal branding.',
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
  },
  {
    id: 2,
    name: 'Event Page',
    description: 'Promote your upcoming events with style and ease.',
    preview: 'bg-gradient-to-tr from-brand-yellow/20 to-gray-800',
  },
  {
    id: 3,
    name: 'Product Showcase',
    description: 'Highlight your latest products with a clean layout.',
    preview: 'bg-black',
  },
];

export default function TemplatePicker() {
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
              <p className="text-gray-400 text-sm md:text-base">Launch a professional micro-page in seconds</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-black/40 border border-gray-800 rounded-2xl p-6 transition-all hover:border-brand-yellow/50 hover:-translate-y-2"
              >
                <div className={cn("w-full h-40 rounded-xl mb-6 flex items-center justify-center overflow-hidden", template.preview)}>
                   <Palette size={48} weight="thin" className="text-white/10 group-hover:text-brand-yellow/20 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {template.description}
                </p>
                <button className="flex items-center gap-2 text-brand-yellow font-bold group-hover:gap-3 transition-all">
                  Use Template <ArrowRight size={18} weight="bold" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="bg-brand-yellow hover:bg-brand-yellow/90 text-black font-bold px-12 py-4 rounded-2xl transition-all"
             >
                Explore All Templates
             </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
