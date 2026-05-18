import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, IndianRupee, Wrench, Package } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Genuine Products',
    description: '100% authentic watches & mobiles with GST bill',
  },
  {
    icon: IndianRupee,
    title: 'Best Price Guarantee',
    description: 'Match any local quote — we beat it when possible',
  },
  {
    icon: Wrench,
    title: 'After Sales Support',
    description: 'Warranty help & band adjustment at our store',
  },
  {
    icon: Package,
    title: 'EMI Available',
    description: 'Easy monthly plans on watches, toys & accessories',
  },
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
    <section className="relative z-10 bg-brand-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group rounded-2xl border border-brand-border bg-brand-card p-6 transition-all duration-300 hover:border-brand-purple/30 hover:shadow-glow-purple"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-purple/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7 text-brand-purple" aria-hidden />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-brand-text md:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-brand-muted md:text-base">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
