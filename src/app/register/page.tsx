'use client';

import Link from 'next/link';
import { Lightning, ArrowRight, Envelope, Lock, User, GoogleLogo, GithubLogo } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-magenta/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-yellow/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="p-2 rounded-xl bg-white group-hover:rotate-12 transition-transform">
              <Lightning size={24} weight="fill" className="text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SnipXR</span>
          </Link>
          <h1 className="text-3xl font-black mb-2">Create Account</h1>
          <p className="text-gray-400">Join the next generation of link management</p>
        </div>

        <div className="bg-dark-gray border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-gray-800 focus:border-brand-magenta/50 focus:ring-1 focus:ring-brand-magenta/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email address</label>
              <div className="relative">
                <Envelope size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-black/40 border border-gray-800 focus:border-brand-magenta/50 focus:ring-1 focus:ring-brand-magenta/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-gray-800 focus:border-brand-magenta/50 focus:ring-1 focus:ring-brand-magenta/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                />
              </div>
            </div>

            <button className="w-full mt-4 bg-white text-black font-black py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Get Started <ArrowRight size={18} weight="bold" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-gray px-2 text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold">
              <GoogleLogo size={20} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold">
              <GithubLogo size={20} /> GitHub
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-400">
          Already have an account? {' '}
          <Link href="/login" className="text-white font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </main>
  );
}
