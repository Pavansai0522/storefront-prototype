import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Phone } from 'lucide-react';
import type { Product } from '../types/product.types';
import { DietBadge, isVegetarianDish } from './DietBadge';
import { WhatsAppIcon } from './WhatsAppIcon';
import { btnPrimary } from '../constants/buttonStyles';
import {
  MENU_SECTION_BLURB,
  menuSectionId,
  restaurantCategoryLabel,
  sortMenuCategories,
} from '../constants/restaurantCategories';
import {
  STORE_PHONE_PRIMARY_DISPLAY,
  STORE_PHONE_PRIMARY_TEL,
  STORE_WHATSAPP_HREF,
} from '../config/store';
import { formatInr } from '../utils/formatCurrency';

type DietFilter = 'all' | 'veg' | 'non-veg';

type RestaurantMenuProps = {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
};

function MenuItemRow({ item }: { item: Product }): JSX.Element {
  const isVeg = isVegetarianDish(item.name, item.category);
  const available = item.inStock !== false;

  return (
    <article className={`border-b border-gold/10 py-4 last:border-b-0 ${available ? '' : 'opacity-55'}`}>
      <div className="flex items-start gap-3">
        <DietBadge isVeg={isVeg} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-lg font-semibold leading-snug text-foreground sm:text-xl">
              {item.name}
              {!available ? (
                <span className="ml-2 font-sans text-xs font-normal italic text-muted">
                  — not served today
                </span>
              ) : null}
            </h3>
            <span className="menu-price-dots hidden min-w-[1.5rem] flex-1 sm:block" aria-hidden />
            <span className="shrink-0 font-serif text-lg font-bold tabular-nums text-gold sm:text-xl">
              {formatInr(item.price)}
            </span>
          </div>
          {item.brand ? (
            <p className="mt-1 max-w-2xl font-serif text-sm italic leading-relaxed text-muted">
              {item.brand}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function RestaurantMenu({
  products,
  emptyTitle = 'Menu coming soon',
  emptyDescription = 'Our kitchen is updating the menu board. Please call us for today\'s specials.',
  emptyActionLabel = 'Call the restaurant',
  emptyActionHref = STORE_PHONE_PRIMARY_TEL,
}: RestaurantMenuProps): JSX.Element {
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');

  const categories = useMemo(
    () => sortMenuCategories(Array.from(new Set(products.map((p) => p.category)))),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const isVeg = isVegetarianDish(item.name, item.category);
      if (dietFilter === 'veg') {
        return isVeg;
      }
      if (dietFilter === 'non-veg') {
        return !isVeg;
      }
      return true;
    });
  }, [products, dietFilter]);

  const groupedSections = useMemo(() => {
    const sections = new Map<string, Product[]>();
    for (const item of filteredProducts) {
      const list = sections.get(item.category) ?? [];
      list.push(item);
      sections.set(item.category, list);
    }
    return sortMenuCategories([...sections.keys()]).map((category) => ({
      category,
      items: sections.get(category) ?? [],
    }));
  }, [filteredProducts]);

  const scrollToSection = (category: string): void => {
    document.getElementById(menuSectionId(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-12 sm:pb-24 sm:pt-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          to="/"
          className="mb-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
          Back home
        </Link>

        <header className="menu-booklet-header text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Aruna&apos;s Eagle · Chilakaluripeta
          </p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">Food Menu</h1>
          <p className="mx-auto mt-4 max-w-lg font-serif text-base italic leading-relaxed text-muted">
            Family dining room · Non-veg kitchen · Dine in &amp; takeaway
          </p>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-5 text-xs uppercase tracking-wider text-muted">
            <span className="inline-flex items-center gap-2">
              <DietBadge isVeg={false} />
              Non-Veg
            </span>
            <span className="inline-flex items-center gap-2">
              <DietBadge isVeg />
              Veg
            </span>
            <span>All prices in ₹</span>
          </div>
        </header>

        {groupedSections.length > 0 ? (
          <>
            <nav
              className="menu-booklet-nav mt-10"
              aria-label="Menu sections"
            >
              <p className="mb-3 text-center font-serif text-sm italic text-muted">Jump to a section</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => scrollToSection(category)}
                    className="font-serif text-sm text-gold underline-offset-4 transition hover:text-gold-hover hover:underline"
                  >
                    {restaurantCategoryLabel(category)}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex justify-center gap-4 border-t border-gold/10 pt-4">
                {(
                  [
                    { id: 'all', label: 'Full menu' },
                    { id: 'veg', label: 'Veg' },
                    { id: 'non-veg', label: 'Non-veg' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDietFilter(option.id)}
                    className={`text-xs uppercase tracking-wider transition ${
                      dietFilter === option.id ? 'font-bold text-gold' : 'text-muted hover:text-gold'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="menu-booklet mt-10">
              {groupedSections.map(({ category, items }) => (
                <section key={category} id={menuSectionId(category)} className="scroll-mt-28 pb-8 last:pb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-gold/30" aria-hidden />
                    <h2 className="shrink-0 text-center font-display text-lg uppercase tracking-[0.18em] text-gold">
                      {restaurantCategoryLabel(category)}
                    </h2>
                    <span className="h-px flex-1 bg-gold/30" aria-hidden />
                  </div>
                  {MENU_SECTION_BLURB[category] ? (
                    <p className="mt-2 text-center font-serif text-sm italic text-muted">
                      {MENU_SECTION_BLURB[category]}
                    </p>
                  ) : null}
                  <div className="mt-4 px-2 sm:px-4">
                    {items.map((item) => (
                      <MenuItemRow key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <footer className="menu-booklet-footer mt-6 text-center">
              <p className="font-serif text-base italic text-muted">
                For table booking, party orders, or takeaway — call our kitchen.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
                <a href={STORE_PHONE_PRIMARY_TEL} className={btnPrimary}>
                  <Phone className="h-4 w-4" aria-hidden />
                  {STORE_PHONE_PRIMARY_DISPLAY}
                </a>
                <a
                  href={STORE_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-serif text-sm text-muted transition hover:text-gold"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Or message on WhatsApp
                </a>
              </div>
              <p className="mt-6 text-xs text-muted/70">
                Government taxes extra · Menu &amp; availability may change daily
              </p>
            </footer>
          </>
        ) : (
          <div className="menu-booklet mt-10 px-6 py-16 text-center">
            <h2 className="font-display text-2xl text-foreground">{emptyTitle}</h2>
            <p className="mt-3 font-serif italic text-muted">{emptyDescription}</p>
            <a href={emptyActionHref} className={`mt-6 ${btnPrimary}`}>
              <Phone className="h-4 w-4" aria-hidden />
              {emptyActionLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
