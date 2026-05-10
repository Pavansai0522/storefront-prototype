import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Battery, Database, ArrowRight } from 'lucide-react';
import { clientConfig, whatsappHref } from '../config/client-config';

const SERVICES = [
  {
    icon: Smartphone,
    title: 'Screen Repair',
    desc: 'Cracked screen? Get original displays replaced in under 60 minutes with warranty.',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    icon: Battery,
    title: 'Battery Replacement',
    desc: 'Phone dying too fast? We install genuine batteries to bring your phone back to 100% health.',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-emerald-400'
  },
  {
    icon: Database,
    title: 'Data Recovery',
    desc: 'Lost your photos or contacts? Our experts can recover data from dead or damaged devices.',
    color: 'from-brand-saffron/20 to-red-500/20',
    iconColor: 'text-brand-saffron'
  }
];

export function Services() {
  return (
    <section id="services" className="relative overflow-x-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 break-words font-display text-3xl uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
            Expert <span className="text-brand-saffron">Repair Services</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 md:text-lg">
            Fast, reliable, and transparent. We fix your devices right in front of you. No hidden
            charges!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative min-w-0 overflow-hidden rounded-3xl border border-white/5 bg-brand-card p-5 transition-all duration-300 md:p-8 md:hover:border-white/20 ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div
                  className={`absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br ${service.color} blur-[60px] opacity-0 transition-opacity duration-500 md:group-hover:opacity-100`}
                />

                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-brand-bg md:mb-8 md:h-16 md:w-16">
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${service.iconColor}`} aria-hidden />
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-white md:mb-4 md:text-2xl">{service.title}</h3>
                  <p className="mb-6 min-h-0 text-sm leading-relaxed text-gray-400 md:mb-8 md:min-h-[80px] md:text-base">
                    {service.desc}
                  </p>

                  <a
                    href={whatsappHref(
                      `Hi ${clientConfig.brand.chatName}! I need help with ${service.title}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-white transition-colors md:hover:text-brand-saffron"
                  >
                    Book Service{' '}
                    <ArrowRight
                      className="h-4 w-4 shrink-0 transform transition-transform md:group-hover:translate-x-1"
                      aria-hidden
                    />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
