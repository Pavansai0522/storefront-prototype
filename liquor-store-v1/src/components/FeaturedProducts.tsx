import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { StockPill } from './StockPill';

const products = [
  {
    id: 1,
    name: "Jack Daniel's Old No.7",
    brand: 'Tennessee Whiskey',
    price: '29.99',
    badge: 'BESTSELLER',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Johnnie Walker Black',
    brand: 'Blended Scotch Whisky',
    price: '39.99',
    badge: 'FEATURED',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Grey Goose Vodka',
    brand: 'Premium French Vodka',
    price: '44.99',
    badge: 'FEATURED',
    inStock: false,
    image:
      'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Caymus Cabernet',
    brand: 'Napa Valley Red Wine',
    price: '89.99',
    badge: 'PREMIUM',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Corona Extra 12pk',
    brand: 'Mexican Lager Beer',
    price: '18.99',
    badge: 'BESTSELLER',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Don Julio Blanco',
    brand: '100% Agave Tequila',
    price: '54.99',
    badge: 'FEATURED',
    inStock: true,
    image:
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

const scrollButtonClass =
  'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold';

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right'): void => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const firstCard = el.querySelector<HTMLElement>('[data-product-card]');
    const amount = firstCard ? firstCard.offsetWidth + 24 : Math.min(el.clientWidth * 0.85, 320);
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="spirits" className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
              FEATURED SELECTIONS
            </h2>
            <div className="h-1 w-24 rounded-full bg-gold" />
            <p className="mt-3 text-sm text-muted sm:hidden">Swipe to browse more</p>
          </div>

          <div className="flex gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => scroll('left')}
              className={scrollButtonClass}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className={scrollButtonClass}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-6 sm:gap-6 sm:pb-8"
        >
          {products.map((product) => {
            const inStock = product.inStock !== false;
            return (
              <div
                key={product.id}
                data-product-card
                className="w-[min(85vw,280px)] shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 group hover:border-gold sm:w-[min(78vw,320px)] md:w-[320px]"
              >
                <div className="relative flex h-56 items-center justify-center bg-background/50 p-4 sm:h-64 sm:p-6">
                  {product.badge ? (
                    <div className="absolute left-4 top-4 z-10 rounded bg-gold px-3 py-1 text-xs font-bold text-background">
                      {product.badge}
                    </div>
                  ) : null}
                  <ProductImage src={product.image} alt={product.name} />
                </div>

                <div className="space-y-4 p-4 sm:p-6">
                  <div>
                    <h3 className="mb-1 line-clamp-2 font-display text-lg font-bold text-foreground sm:text-xl">
                      {product.name}
                    </h3>
                    <p className="line-clamp-1 text-sm text-muted">{product.brand}</p>
                  </div>

                  <div className="flex min-w-0 items-center justify-between gap-3 border-t border-border/60 pt-3">
                    <span className="text-xl font-bold tabular-nums text-gold sm:text-2xl">
                      ${product.price}
                    </span>
                    <StockPill inStock={inStock} />
                  </div>

                  <button
                    type="button"
                    className="min-h-[44px] w-full rounded border border-gold py-3 font-bold text-gold transition-colors duration-300 hover:bg-gold hover:text-background"
                  >
                    Call to Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
