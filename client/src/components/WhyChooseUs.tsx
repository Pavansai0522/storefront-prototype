import React from 'react';
import { motion } from 'framer-motion';
import { clientConfig } from '../config/client-config';
import { Tag, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';
import { STORE_SECTION_BASE, STORE_TILE_HOVER, STORE_TILE_SURFACE } from '../constants/ui';

const FEATURES = [
  {
    icon: Tag,
    title: 'Best Price Guarantee',
    desc: 'Found it cheaper? We will match it. Sabse sasta yahi milega!',
  },
  {
    icon: CreditCard,
    title: 'Easy EMI Available',
    desc: '0% interest options on credit & debit cards. Instant approval.',
  },
  {
    icon: RefreshCw,
    title: 'Top Exchange Value',
    desc: 'Upgrade easily. Get the highest value for your old smartphone.',
  },
  {
    icon: ShieldCheck,
    title: '1-Year Service Support',
    desc: 'Free software support and priority hardware repair for 1 year.',
  },
];

export function WhyChooseUs() {
  return (
    <section className={`relative overflow-x-hidden border-y border-brand-border ${STORE_SECTION_BASE} py-24`}>
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-blue/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 break-words font-display text-3xl uppercase tracking-tight text-brand-text md:text-5xl lg:text-6xl">
            Why Choose <span className="text-brand-blue">{clientConfig.brand.chatName}?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-brand-muted md:text-lg">
            We don&apos;t just sell phones, we build relationships. Join thousands of happy customers who
            trust us for their tech needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group min-w-0 rounded-3xl p-5 ${STORE_TILE_SURFACE} ${STORE_TILE_HOVER} md:p-8`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-blue-200 bg-blue-100 transition-all duration-300 md:mb-6 md:h-14 md:w-14 md:group-hover:scale-110">
                  <Icon className="h-5 w-5 text-brand-blue md:h-7 md:w-7" aria-hidden />
                </div>
                <h3 className="mb-2 text-base font-bold text-brand-text md:mb-3 md:text-xl">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-brand-muted md:text-base">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
