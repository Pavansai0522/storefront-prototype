import React from 'react';
import { Link } from 'react-router-dom';
import { DietBadge, isVegetarianDish } from './DietBadge';
import { useStoreData } from '../context/StoreDataContext';
import { formatInr } from '../utils/formatCurrency';

export function MenuHighlights(): JSX.Element {
  const { featuredProducts, catalogLoading } = useStoreData();
  const items = featuredProducts.slice(0, 6);

  return (
    <section id="menu-highlights" className="bg-maroon-deep py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">From Our Kitchen</p>
          <h2 className="mt-3 font-display text-3xl text-foreground md:text-4xl">House Favourites</h2>
          <p className="mx-auto mt-3 max-w-lg font-serif text-sm italic text-muted">
            Guest favourites from the dining room — see the full menu card for all sections.
          </p>
          <Link
            to="/menu"
            className="mt-4 inline-block font-serif text-sm text-gold underline-offset-4 hover:underline"
          >
            Open full food menu
          </Link>
        </div>

        {catalogLoading ? (
          <p className="text-center text-sm text-muted">Loading menu…</p>
        ) : (
          <div className="menu-booklet px-4 sm:px-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex items-start gap-3 border-b border-gold/10 py-4 last:border-b-0"
              >
                <DietBadge isVeg={isVegetarianDish(item.name, item.category, item.dietType)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-serif text-lg font-semibold text-foreground">{item.name}</h3>
                    <span className="menu-price-dots hidden min-w-[1rem] flex-1 sm:block" aria-hidden />
                    <span className="shrink-0 font-serif font-bold tabular-nums text-gold">
                      {formatInr(item.price)}
                    </span>
                  </div>
                  {item.brand ? (
                    <p className="mt-1 font-serif text-sm italic text-muted">{item.brand}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
