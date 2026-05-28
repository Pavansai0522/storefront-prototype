import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Headphones, Cable, Watch, BatteryCharging, LucideIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
import { ACCESSORY_CATEGORIES, type AccessoryCategoryId } from '../data/accessories';
import { useStoreAccessories, useStoreData } from '../context/StoreDataContext';
import { CatalogSectionLoading } from '../components/CatalogSectionLoading';

const CATEGORY_VISUALS: Record<
  AccessoryCategoryId,
  { icon: LucideIcon; iconBg: string; iconBorder: string; iconColor: string; hoverBorder: string }
> = {
  audio: {
    icon: Headphones,
    iconBg: 'bg-fuchsia-100',
    iconBorder: 'border-fuchsia-200',
    iconColor: 'text-fuchsia-600',
    hoverBorder: 'md:hover:border-fuchsia-300',
  },
  cables: {
    icon: Cable,
    iconBg: 'bg-cyan-100',
    iconBorder: 'border-cyan-200',
    iconColor: 'text-cyan-600',
    hoverBorder: 'md:hover:border-cyan-300',
  },
  wearables: {
    icon: Watch,
    iconBg: 'bg-emerald-100',
    iconBorder: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    hoverBorder: 'md:hover:border-emerald-300',
  },
  power: {
    icon: BatteryCharging,
    iconBg: 'bg-blue-100',
    iconBorder: 'border-blue-200',
    iconColor: 'text-brand-blue',
    hoverBorder: 'md:hover:border-blue-300',
  },
};

export function Accessories(): JSX.Element {
  const { catalogLoading } = useStoreData();
  const accessoryItems = useStoreAccessories();
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 text-brand-text selection:bg-brand-blue selection:text-white">
      <Navbar />

      <main className="pb-20 pt-28">
        <section className="storefront-shell mb-10">
          <Link
            to="/"
            className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-brand-muted transition-colors hover:text-brand-blue">
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to Home
          </Link>

          <div className="max-w-3xl">
            <h1 className="mb-4 break-words font-display text-2xl uppercase tracking-tight text-brand-text md:text-4xl">
              Premium <span className="text-brand-blue">Accessories</span>
            </h1>
            <p className="break-words text-base text-brand-muted md:text-lg">
              Pick a category — each has its own grid with filters, 4×4 pages, and a clear{' '}
              <span className="font-semibold text-brand-text">item ref</span> you can drop into WhatsApp so
              the team knows exactly what you mean.
            </p>
          </div>
        </section>

        <section className="storefront-shell">
          {catalogLoading ? (
            <CatalogSectionLoading message="Loading accessories…" />
          ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {ACCESSORY_CATEGORIES.map((cat, index) => {
              const visual = CATEGORY_VISUALS[cat.id];
              const Icon = visual.icon;
              const count = accessoryItems.filter((p) => p.categoryId === cat.id).length;
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
                    className={`group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-slate-200 bg-white p-4 text-center shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-all duration-300 ${visual.hoverBorder} md:hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)]`}>
                    <div
                      className={`relative mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 ${visual.iconBorder} ${visual.iconBg} ${visual.iconColor} md:mb-4 md:h-16 md:w-16`}>
                      <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h2 className="line-clamp-2 text-sm font-bold text-brand-text md:text-base">
                      {cat.title}
                    </h2>
                    <p className="mt-1 text-xs text-brand-muted">{count} items</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
