import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, IndianRupee, Package, MessageCircle } from 'lucide-react';
import { clientConfig, whatsappHref } from '../config/client-config';
import { btnShop, btnWhatsApp } from '../constants/buttonStyles';

const TRUST_BULLETS = [
  { icon: ShieldCheck, text: '100% genuine — bill provided' },
  { icon: IndianRupee, text: 'Easy EMI on watches & mobiles' },
  { icon: Package, text: 'Same-day pickup in store' },
];

export function Hero(): JSX.Element {
  return (
    <section
      id="home"
      className="relative mt-10 flex items-center bg-brand-bg py-16 sm:py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-[280px] w-[280px] rounded-full bg-brand-purple/20 blur-[100px] sm:right-0 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] md:blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[200px] w-[200px] rounded-full bg-brand-purple/10 blur-[80px] md:h-[280px] md:w-[280px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-w-0 max-w-2xl"
          >
            <p className="mb-3 text-xs font-bold leading-snug text-brand-purple sm:text-sm">
              {clientConfig.brand.teluguTagline}
            </p>

            <h1 className="mb-6 break-words font-bebas text-4xl leading-[0.95] tracking-wide text-brand-text sm:text-5xl md:text-6xl lg:text-7xl">
              CHILAKALURIPET&apos;S FINEST <br />
              <span className="text-brand-purple">WATCHES & TOYS</span>
            </h1>

            <p className="mb-6 max-w-lg text-base font-normal leading-relaxed text-brand-text sm:text-lg md:text-xl">
              Premium timepieces, exciting toys, and quality audio gear — all under one roof.
              Trusted since {clientConfig.brand.trustedSince}.
            </p>

            <ul className="mb-10 space-y-2">
              {TRUST_BULLETS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-brand-text sm:text-base">
                  <Icon className="h-4 w-4 shrink-0 text-brand-purple" aria-hidden />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/watches" className={`${btnShop} w-full sm:w-auto`}>
                Shop Now
              </Link>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btnWhatsApp} w-full sm:w-auto`}
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                WhatsApp Us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden h-[500px] lg:block"
          >
            <div className="absolute right-10 top-0 z-20 h-80 w-64 rotate-3 transform overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-xl transition-transform duration-500 hover:rotate-0">
              <img
                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
                alt="Premium watch collection"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-10 z-10 h-80 w-64 -rotate-6 transform overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-xl transition-transform duration-500 hover:rotate-0">
              <img
                src="https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=800"
                alt="Toys and gifts"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite] rounded-full border border-brand-purple/25" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-[spin_30s_linear_infinite_reverse] rounded-full border border-brand-purple/15" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
