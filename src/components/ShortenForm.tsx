'use client';

import { useState } from 'react';
import { LinkSimple, Copy, Check, WarningCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ShortenForm() {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresAccount, setRequiresAccount] = useState(false);

  const validateUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequiresAccount(false);

    if (!url) return;
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.requiresAccount) setRequiresAccount(true);
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.shortUrl) {
        setShortened(data.shortUrl);
        const saved = JSON.parse(localStorage.getItem("anon_links") ?? "[]");
        saved.push(data.code);
        localStorage.setItem("anon_links", JSON.stringify(saved));
      }
    } catch (err: any) {
      setError(err.message || "Failed to shorten link");
      console.error("Failed to shorten link:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortened) {
      navigator.clipboard.writeText(shortened);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-12 px-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-dark-gray rounded-3xl p-6 md:p-12 shadow-2xl border border-brand-blue/20 transition-all hover:border-brand-blue/40">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="p-3 bg-brand-blue/10 rounded-2xl w-fit">
              <LinkSimple size={32} weight="bold" className="text-brand-blue" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Shorten Link</h2>
              <p className="text-gray-400 text-sm md:text-base">Transform your long URLs into bite-sized links</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="url"
                placeholder="https://example.com/very-long-url-to-shorten"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={cn(
                  "w-full bg-black/40 border text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 transition-all",
                  error ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500" : "border-gray-700 focus:ring-brand-blue/50 focus:border-brand-blue"
                )}
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 md:mt-0 md:absolute md:right-2 md:top-2 md:bottom-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-8 rounded-xl transition-all active:scale-95 w-full md:w-auto py-3 md:py-0 disabled:opacity-50"
              >
                {loading ? 'Shortening...' : 'Shorten Now'}
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-2 mt-2"
              >
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <WarningCircle size={16} weight="fill" />
                  <span>{error}</span>
                </div>
                {requiresAccount && (
                  <a
                    href="/register"
                    className="text-sm font-bold text-brand-blue hover:underline"
                  >
                    Create a free account →
                  </a>
                )}
              </motion.div>
            )}
          </form>

          {shortened && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex flex-col">
                <span className="text-sm text-brand-blue font-medium mb-1">Your shortened link:</span>
                <span className="text-xl font-mono text-white break-all">{shortened}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full md:w-auto justify-center",
                  copied ? "bg-green-500 text-white" : "bg-white text-dark-gray hover:bg-gray-200"
                )}
              >
                {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
