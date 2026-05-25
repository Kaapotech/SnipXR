'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Lightning, Crown, Sparkle, RocketLaunch } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'Perfect for getting started.',
    icon: Lightning,
    iconColor: 'text-brand-blue',
    iconBg: 'bg-brand-blue/10',
    checkColor: 'text-brand-blue',
    border: 'border-white/10',
    bg: 'bg-white/5',
    badge: null,
    features: [
      '15 links / month',
      '5 QR codes / month',
      'No analytics',
      'No custom domain',
      'No templates',
      '1 user',
    ],
    cta: 'free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: '/ month',
    description: 'For creators and freelancers.',
    icon: Crown,
    iconColor: 'text-brand-magenta',
    iconBg: 'bg-brand-magenta/10',
    checkColor: 'text-brand-magenta',
    border: 'border-brand-magenta/40',
    bg: 'bg-dark-gray',
    badge: 'Recommended',
    badgeGradient: 'from-brand-magenta to-brand-yellow',
    shadow: 'shadow-2xl shadow-brand-magenta/10',
    features: [
      '500 links / month',
      '30 dynamic QR codes / month',
      '3 custom domains',
      'Advanced analytics (1 year retention)',
      '5 QR templates',
      'Link expiration + password protection',
      '1 user + API access',
    ],
    cta: 'coming_soon',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: '$29',
    period: '/ month',
    description: 'For teams and agencies.',
    icon: RocketLaunch,
    iconColor: 'text-brand-yellow',
    iconBg: 'bg-brand-yellow/10',
    checkColor: 'text-brand-yellow',
    border: 'border-brand-yellow/30',
    bg: 'bg-dark-gray',
    badge: null,
    features: [
      '3,000 links / month',
      '200 dynamic QR codes / month',
      '10 custom domains',
      'Premium analytics (3 years) + geo/device targeting',
      'Unlimited templates',
      'A/B testing on links',
      '5 users + webhooks',
    ],
    cta: 'coming_soon',
  },
];

export default function PlansPage() {
  const { data: session } = useSession();
  const isPro = session?.user?.plan === 'pro';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkle size={16} weight="fill" className="text-brand-yellow" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Choose your plan</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
              Simple and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-yellow">
                transparent
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Start for free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              const isCurrent = plan.id === 'free'
                ? (session && !isPro)
                : (plan.id === 'pro' && isPro);

              return (
                <motion.div
                  key={plan.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className={cn(
                    'relative rounded-3xl p-6 border flex flex-col',
                    plan.bg,
                    plan.border,
                    plan.shadow ?? ''
                  )}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={cn(
                        'bg-gradient-to-r text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider',
                        plan.badgeGradient
                      )}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={cn('p-2 rounded-xl', plan.iconBg)}>
                      <Icon size={20} weight="bold" className={plan.iconColor} />
                    </div>
                    <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                  </div>

                  <div className="mb-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm ml-1.5">{plan.period}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">{plan.description}</p>

                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-gray-300">
                        <Check size={15} weight="bold" className={cn('mt-0.5 shrink-0', plan.checkColor)} />
                        <span className="text-xs leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.cta === 'free' && (
                    isCurrent ? (
                      <div className="w-full py-3 rounded-2xl border border-white/10 text-center text-xs font-bold text-gray-500 cursor-default">
                        Your current plan
                      </div>
                    ) : session ? (
                      <div className="w-full py-3 rounded-2xl border border-white/10 text-center text-xs font-bold text-gray-500 cursor-default">
                        Active plan
                      </div>
                    ) : (
                      <Link
                        href="/register"
                        className="block w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-center text-xs font-bold text-white transition-all active:scale-95"
                      >
                        Get started free
                      </Link>
                    )
                  )}

                  {plan.cta === 'coming_soon' && (
                    <>
                      <button
                        disabled
                        className={cn(
                          'w-full py-3 rounded-2xl font-bold text-xs opacity-50 cursor-not-allowed',
                          plan.id === 'pro'
                            ? 'bg-gradient-to-r from-brand-magenta to-brand-yellow text-white'
                            : 'bg-gradient-to-r from-brand-yellow to-brand-blue text-white'
                        )}
                      >
                        Coming Soon
                      </button>
                      <p className="text-center text-xs text-gray-600 mt-2">
                        Available soon
                      </p>
                    </>
                  )}

                  {plan.cta === 'contact' && (
                    <a
                      href="mailto:contact@snipxr.com"
                      className="block w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-center text-xs font-bold text-white transition-all active:scale-95"
                    >
                      Contact us
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center text-gray-600 text-sm mt-12"
          >
            Have questions? Reach us at{' '}
            <span className="text-gray-400">contact@snipxr.com</span>
          </motion.p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
