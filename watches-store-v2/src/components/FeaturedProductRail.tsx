import React from 'react';
import { motion } from 'framer-motion';

type FeaturedProductRailProps = {
  id?: string;
  title: string;
  accentClassName?: string;
  children: React.ReactNode;
};

/** Mobile: horizontal snap rail. Desktop: responsive grid — single page scroll only. */
export function FeaturedProductRail({
  id,
  title,
  accentClassName = 'bg-brand-purple',
  children,
}: FeaturedProductRailProps): JSX.Element {
  return (
    <section id={id} className="relative z-10 bg-brand-bg py-16 md:py-24">
      <div className="storefront-shell mb-10 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-bebas text-4xl font-normal tracking-wide text-black md:text-5xl">
            {title}
          </h2>
          <div className={`mt-4 h-1 w-24 rounded-full ${accentClassName}`} />
        </motion.div>
      </div>

      {/*
        Do not use touch-pan-x — it blocks vertical page scroll when the finger starts on this row.
      */}
      <div className="scroll-rail w-full max-w-[100vw] snap-x snap-proximity overflow-x-auto overflow-y-visible pb-10 md:overflow-visible md:snap-none md:pb-0">
        <div className="flex w-max min-w-full gap-4 px-4 sm:gap-6 sm:px-6 md:mx-auto md:w-full md:max-w-screen-2xl md:grid md:grid-cols-2 md:gap-6 md:px-8 lg:px-12 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:px-16">
          {children}
        </div>
      </div>
    </section>
  );
}
