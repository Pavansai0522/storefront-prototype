import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle, Send, Youtube } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { STORE_SECTION_SURFACE } from '../constants/ui';

const STAT_ICONS = {
  facebook: {
    icon: Facebook,
    iconClass: 'text-blue-600',
    iconBg: 'bg-blue-100',
    iconBorder: 'border-blue-200',
    glow: 'from-blue-500/20 to-blue-600/10',
  },
  instagram: {
    icon: Instagram,
    iconClass: 'text-pink-600',
    iconBg: 'bg-pink-100',
    iconBorder: 'border-pink-200',
    glow: 'from-pink-500/20 to-fuchsia-500/10',
  },
  youtube: {
    icon: Youtube,
    iconClass: 'text-red-600',
    iconBg: 'bg-red-100',
    iconBorder: 'border-red-200',
    glow: 'from-red-500/20 to-orange-500/10',
  },
} as const;

type StatKey = keyof typeof STAT_ICONS;

export function SocialProof(): JSX.Element {
  const { social, socialStats } = useStoreConfig();

  const hrefByKey: Record<StatKey, string> = {
    facebook: social.facebook,
    instagram: social.instagram,
    youtube: social.youtube,
  };

  const stats = (['facebook', 'instagram', 'youtube'] as const).map((key) => ({
    key,
    ...STAT_ICONS[key],
    ...socialStats[key],
    href: hrefByKey[key],
  }));

  return (
    <section className={`relative overflow-x-hidden ${STORE_SECTION_SURFACE} py-20`}>
      <motion.div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-blue p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)] md:p-10 lg:p-12">
          <motion.div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-blue/30 blur-3xl" />
          <motion.div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-brand-saffron/20 blur-3xl" />

          <motion.div className="relative z-10 mb-8 text-center md:mb-10">
            <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              Going viral on Reels
            </span>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
              Join Our <span className="text-brand-saffron">Community</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 md:text-base">
              Follow us for unboxings, deals, and repair tips — thousands already do.
            </p>
          </motion.div>

          <motion.div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.a
                  key={stat.key}
                  href={stat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md transition-transform duration-300 md:hover:-translate-y-1">
                  <motion.div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <motion.div className="relative z-10">
                    <motion.div
                      className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${stat.iconBorder} ${stat.iconBg} ${stat.iconClass} shadow-sm`}>
                      <Icon className="h-7 w-7" aria-hidden />
                    </motion.div>
                    <p className="font-display text-4xl tracking-wide text-white md:text-5xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {stat.label}
                    </p>
                  </motion.div>
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div className="relative z-10 mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={social.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp Channel
            </a>
            <a
              href={social.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
              <Send className="h-4 w-4" aria-hidden />
              Telegram
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
