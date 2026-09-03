import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, IndianRupee, Wrench } from 'lucide-react';

type WhyChooseFeature = {
  icon: typeof Trophy;
  title: string;
  description: string;
  iconBgClass: string;
  iconTextClass: string;
};

const features: WhyChooseFeature[] = [
  {
    icon: Trophy,
    title: 'Genuine Products',
    description: '100% authentic watches & mobiles with GST bill',
    iconBgClass: 'bg-emerald-500/15',
    iconTextClass: 'text-emerald-600',
  },
  {
    icon: IndianRupee,
    title: 'Best Price Guarantee',
    description: 'Match any local quote — we beat it when possible',
    iconBgClass: 'bg-amber-500/15',
    iconTextClass: 'text-amber-600',
  },
  {
    icon: Wrench,
    title: 'After Sales Support',
    description: 'Warranty help & band adjustment at our store',
    iconBgClass: 'bg-sky-500/15',
    iconTextClass: 'text-sky-600',
  },
  // EMI not currently offered
  // {
  //   icon: Package,
  //   title: 'EMI Available',
  //   description: 'Easy monthly plans on watches, toys & accessories',
  //   iconBgClass: 'bg-brand-purple/15',
  //   iconTextClass: 'text-brand-purple',
  // },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function WhyChooseUs(): JSX.Element {
  return (
    <section className="relative z-10 bg-brand-text py-16 md:py-20">
      <div className="storefront-shell">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-8 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/40 hover:shadow-glow-purple sm:p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-14 sm:w-14 ${feature.iconBgClass}`}
                >
                  <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.iconTextClass}`} aria-hidden />
                </div>
                <h3 className="mb-1.5 text-base font-semibold leading-snug text-white sm:mb-2 sm:text-lg md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/80 sm:text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
