import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Battery, Database, ArrowRight } from 'lucide-react';
import { clientConfig, whatsappHref } from '../config/client-config';

import { STORE_SECTION_BASE, STORE_TILE_HOVER, STORE_TILE_SURFACE } from '../constants/ui';

const SERVICES = [
  {
    icon: Smartphone,
    title: 'Screen Repair',
    desc: 'Cracked screen? Get original displays replaced in under 60 minutes with warranty.',
    iconBg: 'bg-cyan-100',
    iconBorder: 'border-cyan-200',
    iconColor: 'text-cyan-600',
    hoverBorder: 'md:hover:border-cyan-300',
  },
  {
    icon: Battery,
    title: 'Battery Replacement',
    desc: 'Phone dying too fast? We install genuine batteries to bring your phone back to 100% health.',
    iconBg: 'bg-emerald-100',
    iconBorder: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    hoverBorder: 'md:hover:border-emerald-300',
  },
  {
    icon: Database,
    title: 'Data Recovery',
    desc: 'Lost your photos or contacts? Our experts can recover data from dead or damaged devices.',
    iconBg: 'bg-blue-100',
    iconBorder: 'border-blue-200',
    iconColor: 'text-brand-blue',
    hoverBorder: 'md:hover:border-blue-300',
  },
];

export function Services() {
  return (
    <section id="services" className={`relative overflow-x-hidden ${STORE_SECTION_BASE} py-24`}>
      <div className="storefront-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 break-words font-display text-3xl uppercase tracking-tight text-brand-text md:text-5xl lg:text-6xl">
            Expert <span className="text-brand-blue">Repair Services</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-brand-muted md:text-lg">
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
                className={`group relative min-w-0 overflow-hidden rounded-3xl p-5 ${STORE_TILE_SURFACE} ${STORE_TILE_HOVER} md:p-8 ${service.hoverBorder} ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className="relative z-10">
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${service.iconBorder} ${service.iconBg} md:mb-8 md:h-16 md:w-16`}>
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${service.iconColor}`} aria-hidden />
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-brand-text md:mb-4 md:text-2xl">{service.title}</h3>
                  <p className="mb-6 min-h-0 text-sm leading-relaxed text-brand-muted md:mb-8 md:min-h-[80px] md:text-base">
                    {service.desc}
                  </p>

                  <a
                    href={whatsappHref(
                      `Hi ${clientConfig.brand.chatName}! I need help with ${service.title}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-brand-text transition-colors md:hover:text-brand-blue"
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
