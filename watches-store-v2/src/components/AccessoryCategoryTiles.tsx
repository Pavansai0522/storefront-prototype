import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cable, Headphones, Smartphone, Cpu, ArrowRight } from 'lucide-react';

const tiles: {
  to: string;
  title: string;
  blurb: string;
  icon: typeof Cable;
}[] = [
  {
    to: '/accessories/cables',
    title: 'Cables',
    blurb: 'Charging, data, and AV cables for phones and devices.',
    icon: Cable,
  },
  {
    to: '/accessories/headphones',
    title: 'Headphones',
    blurb: 'Wired and wireless earbuds and over-ear audio.',
    icon: Headphones,
  },
  {
    to: '/accessories/phone-accessories',
    title: 'Phone accessories',
    blurb: 'Phone cases, screen guards, chargers, and mobile essentials.',
    icon: Smartphone,
  },
  {
    to: '/accessories/gadgets',
    title: 'Gadgets',
    blurb: 'Smart accessories, chargers, and everyday tech add-ons.',
    icon: Cpu,
  },
];

export function AccessoryCategoryTiles(): JSX.Element {
  return (
    <section className="relative z-10 border-b border-brand-border bg-brand-bg pb-12 pt-4">
      <div className="storefront-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-bebas text-3xl font-normal tracking-wide text-black md:text-4xl">
            BROWSE ACCESSORIES
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-brand-purple" />
          <p className="mt-3 max-w-xl text-sm font-normal text-black md:text-base">
            Pick a category to open its dedicated page.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="flex h-full min-h-0 min-w-0"
              >
                <Link
                  to={tile.to}
                  className="group flex h-full min-h-[240px] w-full flex-col rounded-2xl border border-brand-purple/20 bg-brand-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/40 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-brand-purple sm:min-h-[260px]"
                >
                  <Icon
                    className="h-10 w-10 shrink-0 text-brand-purple transition-transform group-hover:scale-110 md:h-12 md:w-12"
                    aria-hidden
                  />
                  <h3 className="mt-4 line-clamp-2 min-h-[3.25rem] shrink-0 font-bebas text-2xl font-normal tracking-wide text-black md:text-3xl">
                    {tile.title}
                  </h3>
                  <p className="mt-2 min-h-[3.75rem] flex-1 text-sm font-normal leading-relaxed text-black line-clamp-3">
                    {tile.blurb}
                  </p>
                  <span
                    className="mt-auto inline-flex shrink-0 pt-3 text-brand-purple opacity-80 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden
                  >
                    <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
