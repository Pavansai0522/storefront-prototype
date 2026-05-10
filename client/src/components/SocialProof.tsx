import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Star } from 'lucide-react';

export function SocialProof() {
  return (
    <section className="relative overflow-x-hidden py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-r from-brand-card to-[#2a1b3d] p-6 shadow-[0_0_50px_rgba(255,107,0,0.1)] md:p-12"
        >
          <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2 md:right-8 md:top-8">
            <div className="rotate-3 rounded-full bg-brand-saffron px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Going Viral on Reels 🔥
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-8 sm:mt-0 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-center sm:gap-0 sm:divide-x sm:divide-white/10">
            <div className="flex flex-col items-center justify-center px-2 text-center sm:flex-1 sm:px-4">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-0.5 text-brand-saffron">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current sm:h-6 sm:w-6" aria-hidden />
                ))}
              </div>
              <h3 className="mb-1 font-display text-4xl tracking-wide text-white sm:text-5xl md:text-6xl">
                10K+
              </h3>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Happy Customers
              </p>
            </div>

            <div className="flex flex-col items-center justify-center border-t border-white/10 px-2 pt-8 text-center sm:flex-1 sm:border-t-0 sm:px-4 sm:pt-0">
              <Instagram className="mb-2 h-7 w-7 text-pink-500 sm:h-8 sm:w-8" aria-hidden />
              <h3 className="mb-1 font-display text-4xl tracking-wide text-white sm:text-5xl md:text-6xl">
                50K+
              </h3>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Instagram Fam
              </p>
            </div>

            <div className="flex flex-col items-center justify-center border-t border-white/10 px-2 pt-8 text-center sm:flex-1 sm:border-t-0 sm:px-4 sm:pt-0">
              <Youtube className="mb-2 h-8 w-8 text-red-500 sm:h-9 sm:w-9" aria-hidden />
              <h3 className="mb-1 font-display text-4xl tracking-wide text-white sm:text-5xl md:text-6xl">
                2019
              </h3>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Trusted Since
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
