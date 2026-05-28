import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, ShieldCheck, Users } from 'lucide-react';
import { whatsappHref } from '../config/client-config';
import { useTrendingPhone } from '../context/StoreDataContext';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { StoreLogo } from './StoreLogo';

export function Hero(): JSX.Element {
  const trending = useTrendingPhone();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-x-hidden overflow-y-visible bg-brand-bg pt-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-32 w-32 rounded-full bg-brand-saffron/15 blur-3xl" />

      <div className="storefront-shell relative z-10 py-12 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8 2xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="min-w-0 text-center lg:text-left"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card px-4 py-2 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-saffron opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-saffron" />
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-brand-muted">
                Sabse Sasta, Sabse Best!
              </span>
            </div>

            <h1 className="mb-6 font-display text-4xl uppercase leading-[0.95] tracking-tight text-brand-text md:text-6xl lg:text-8xl">
              Your Next{' '}
              <span className="text-brand-blue">Phone.</span>
              <br />
              Your Nearest{' '}
              <span className="text-brand-saffron">Store.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-sm text-brand-muted md:text-base lg:mx-0">
              Upgrade to the latest smartphones with guaranteed best prices, easy EMI options, and
              instant exchange value. Naya Phone, Naya Vibe!
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#phones"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-8 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(29,78,216,0.25)] transition-all hover:bg-brand-blueHover sm:w-auto md:hover:-translate-y-1"
              >
                <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
                Shop Now
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-border bg-white px-8 py-4 text-lg font-bold text-brand-text transition-all hover:border-brand-blue/40 hover:bg-brand-surface sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                WhatsApp Us
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex min-h-[44px] items-center gap-2 text-brand-muted">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
                <span className="font-medium">Trusted Since 2019</span>
              </div>
              <div className="flex min-h-[44px] items-center gap-2 text-brand-muted">
                <Users className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
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
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs sm:max-w-md xl:max-w-lg 2xl:max-w-xl">
              <div className="pointer-events-none absolute inset-0 scale-90 rotate-12 rounded-[3rem] bg-gradient-to-tr from-brand-blue/20 to-brand-saffron/15 blur-3xl" />

              {trending?.img ? (
                <img
                  src={trending.img}
                  alt={trending.name}
                  className="relative z-10 h-full w-full rounded-[2.5rem] border border-brand-border object-cover shadow-xl transition-transform duration-500 -rotate-6 md:hover:rotate-0"
                />
              ) : trending ? (
                <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[2.5rem] border border-brand-border bg-brand-card shadow-xl -rotate-6 md:hover:rotate-0">
                  <ProductImagePlaceholder label={trending.brand} />
                </div>
              ) : (
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2.5rem] border border-brand-border bg-brand-card p-8 shadow-xl -rotate-6 md:hover:rotate-0">
                  <StoreLogo variant="hero" linked={false} />
                </div>
              )}

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 z-20 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-brand-border bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-saffron/15">
                    <span className="text-2xl" aria-hidden>
                      🔥
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase text-brand-muted">Trending Now</p>
                    <p className="truncate font-bold text-brand-text">
                      {trending?.name ?? 'Ask us for today\'s best deals'}
                    </p>
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
