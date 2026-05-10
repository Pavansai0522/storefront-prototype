import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Headphones, Cable, Watch, BatteryCharging, LucideIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import {
  ACCESSORY_CATEGORIES,
  ACCESSORY_ITEMS,
  type AccessoryCategoryId
} from '../data/accessories';

const CATEGORY_VISUALS: Record<
  AccessoryCategoryId,
  { icon: LucideIcon; gradient: string; iconColor: string }
> = {
  audio: {
    icon: Headphones,
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    iconColor: 'text-fuchsia-400'
  },
  cables: {
    icon: Cable,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400'
  },
  wearables: {
    icon: Watch,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400'
  },
  power: {
    icon: BatteryCharging,
    gradient: 'from-brand-saffron/25 to-amber-500/20',
    iconColor: 'text-brand-saffron'
  }
};

export function Accessories(): JSX.Element {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-bg text-brand-text selection:bg-brand-saffron selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <section className="mx-auto mb-10 max-w-7xl px-4 md:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-brand-saffron">
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <h1 className="mb-4 break-words font-display text-2xl uppercase tracking-tight text-white md:text-4xl">
              Premium <span className="text-brand-saffron">Accessories</span>
            </h1>
            <p className="break-words text-base text-gray-400 md:text-lg">
              Pick a category — each has its own grid with filters, 4×4 pages, and a clear{' '}
              <span className="font-semibold text-white">item ref</span> you can drop into WhatsApp so
              the team knows exactly what you mean.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {ACCESSORY_CATEGORIES.map((cat, index) => {
              const visual = CATEGORY_VISUALS[cat.id];
              const Icon = visual.icon;
              const count = ACCESSORY_ITEMS.filter((p) => p.categoryId === cat.id).length;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.24) }}
                  className="min-w-0">
                  <Link
                    to={`/accessories/${cat.id}`}
                    className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-brand-card p-4 text-center transition-colors md:hover:border-brand-saffron/40">
                    <div
                      className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${visual.gradient} blur-[50px] opacity-60 transition-opacity duration-500 md:group-hover:opacity-100`}
                    />
                    <div
                      className={`relative mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${visual.iconColor} md:mb-4 md:h-16 md:w-16`}>
                      <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h2 className="relative z-[1] line-clamp-2 text-sm font-bold text-white md:text-base">
                      {cat.title}
                    </h2>
                    <p className="relative z-[1] mt-1 text-xs text-gray-500">{count} items</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
