import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, ShieldCheck, Users } from 'lucide-react';
import { whatsappHref } from '../config/client-config';

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-x-hidden overflow-y-visible pt-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-saffron/20 opacity-50 blur-[120px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 md:px-8 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="min-w-0 text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-saffron opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-saffron"></span>
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-gray-300">
                Sabse Sasta, Sabse Best!
              </span>
            </div>

            <h1 className="mb-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-8xl">
              Your Next{' '}
              <span className="text-brand-saffron drop-shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                Phone.
              </span>
              <br />
              Your Nearest{' '}
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Store.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-sm text-gray-400 md:text-base lg:mx-0">
              Upgrade to the latest smartphones with guaranteed best prices, easy EMI options, and
              instant exchange value. Naya Phone, Naya Vibe!
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#phones"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-saffron px-8 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all hover:bg-brand-saffronHover hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] sm:w-auto md:hover:-translate-y-1"
              >
                <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
                Shop Now
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-transparent px-8 py-4 text-lg font-bold text-white transition-all hover:border-white/40 hover:bg-white/5 sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                WhatsApp Us
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex min-h-[44px] items-center gap-2 text-gray-400">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-saffron" aria-hidden />
                <span className="font-medium">Trusted Since 2019</span>
              </div>
              <div className="flex min-h-[44px] items-center gap-2 text-gray-400">
                <Users className="h-5 w-5 shrink-0 text-brand-saffron" aria-hidden />
                <span className="font-medium">10K+ Customers</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative min-w-0"
          >
            {/* Phone + floating “Trending” card — original framing, tilt + hover straighten on md+ */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs sm:max-w-md">
              <div className="pointer-events-none absolute inset-0 scale-90 rotate-12 rounded-[3rem] bg-gradient-to-tr from-brand-saffron/40 to-purple-600/20 blur-3xl"></div>

              <img
                src="https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80"
                alt="Latest Premium Smartphone"
                className="relative z-10 h-full w-full rounded-[2.5rem] border border-white/10 object-cover shadow-2xl transition-transform duration-500 transform -rotate-6 md:hover:rotate-0"
              />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 z-20 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-brand-saffron/30 bg-brand-card p-4 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-saffron/20">
                    <span className="text-2xl" aria-hidden>
                      🔥
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase text-gray-400">Trending Now</p>
                    <p className="font-bold text-white">iPhone 15 Pro</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
