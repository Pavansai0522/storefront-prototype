import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 2,
  name: 'Johnnie Walker Black',
  brand: 'Blended Scotch Whisky',
  price: '39.99',
  badge: 'FEATURED',
  inStock: true,
  image:
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 3,
  name: 'Grey Goose Vodka',
  brand: 'Premium French Vodka',
  price: '44.99',
  badge: 'FEATURED',
  inStock: false,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 4,
  name: 'Caymus Cabernet',
  brand: 'Napa Valley Red Wine',
  price: '89.99',
  badge: 'PREMIUM',
  inStock: true,
  image:
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 5,
  name: 'Corona Extra 12pk',
  brand: 'Mexican Lager Beer',
  price: '18.99',
  badge: 'BESTSELLER',
  inStock: true,
  image:
  'https://images.unsplash.com/photo-1614315584646-992144d03e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
},
{
  id: 6,
  name: 'Don Julio Blanco',
  brand: '100% Agave Tequila',
  price: '54.99',
  badge: 'FEATURED',
  inStock: true,
  image:
  'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
}];

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  return (
    <section
      id="spirits"
      className="py-24 bg-background relative overflow-hidden">
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              FEATURED SELECTIONS
            </h2>
            <div className="w-24 h-1 bg-gold rounded-full"></div>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
              aria-label="Scroll left">
              
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
              aria-label="Scroll right">
              
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
          
          {products.map((product) => {
            const inStock = product.inStock !== false;
            return (
          <div
            key={product.id}
            className="min-w-[280px] md:min-w-[320px] bg-card border border-border rounded-xl overflow-hidden flex-shrink-0 snap-start group hover:border-gold transition-colors duration-300">
            
              <div className="relative h-64 bg-background/50 p-6 flex items-center justify-center">
                {product.badge ? (
                <div className="absolute top-4 left-4 bg-gold text-background text-xs font-bold px-3 py-1 rounded z-10">
                  {product.badge}
                </div>
                ) : null}
                <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain mix-blend-screen opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted truncate">{product.brand}</p>
                </div>

                <div className="flex w-full min-w-0 items-center justify-between gap-3 border-t border-border/60 pt-3">
                  <span className="text-2xl font-bold text-gold tabular-nums">
                    ${product.price}
                  </span>
                  <StockPill inStock={inStock} />
                </div>

                <button className="w-full py-3 border border-gold text-gold hover:bg-gold hover:text-background font-bold rounded transition-colors duration-300 min-h-[44px]">
                  Call to Order
                </button>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>);

}