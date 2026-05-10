import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { clientConfig } from '../config/client-config';

export function VisitUs() {
  return (
    <section id="visit" className="relative overflow-x-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="min-w-0"
          >
            <h2 className="mb-6 break-words font-display text-4xl uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
              Visit Our <span className="text-brand-saffron">Store</span>
            </h2>
            <p className="mb-10 text-base text-gray-400 md:text-lg">
              Experience the latest tech hands-on. Drop by for a coffee, check out new phones, or get
              your device fixed by experts.
            </p>

            <div className="w-full space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <MapPin className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-white">Store Address</h4>
                  <p className="break-words leading-relaxed text-gray-400">
                    {clientConfig.location.addressLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <Clock className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-white">Opening Hours</h4>
                  <p className="text-gray-400">Monday - Sunday</p>
                  <p className="font-medium text-white">10:30 AM - 9:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <Phone className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0 break-words">
                  <h4 className="mb-2 text-xl font-bold text-white">Contact</h4>
                  <p className="text-gray-400">{clientConfig.contact.phoneDisplay}</p>
                  <p className="text-gray-400">{clientConfig.contact.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 md:h-[400px] lg:h-[500px]"
          >
            <div className="absolute inset-0 bg-[#1a1c23] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 animate-ping rounded-full bg-brand-saffron opacity-40"></div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-saffron shadow-[0_0_30px_rgba(255,107,0,0.5)]">
                  <MapPin className="h-8 w-8 text-white" aria-hidden />
                </div>
              </div>

              <div className="max-w-xs rounded-2xl border border-white/10 bg-brand-card/90 p-4 shadow-2xl backdrop-blur-md">
                <h3 className="mb-1 text-lg font-bold text-white">{clientConfig.location.mapCardTitle}</h3>
                <p className="mb-4 text-sm text-gray-400">{clientConfig.location.mapCardSubtitle}</p>
                <a
                  href="#"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-bold text-black transition-colors hover:bg-gray-200">
                  <Navigation className="h-4 w-4 shrink-0" aria-hidden />
                  Get Directions
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
