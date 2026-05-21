import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Whisky & Bourbon', icon: '🥃', path: '/spirits' },
  { name: 'Scotch', icon: '🥃', path: '/spirits' },
  { name: 'Rare Bottles', icon: '💎', path: '/#rare-bottles' },
  { name: 'Wine & Champagne', icon: '🍷', path: '/wine' },
  { name: 'Vodka & Gin', icon: '🍸', path: '/spirits' },
  { name: 'Beer & Craft', icon: '🍺', path: '/beer' },
  { name: 'Tequila & Mezcal', icon: '🌵', path: '/spirits' },
  { name: 'Rum & Brandy', icon: '🥂', path: '/spirits' },
];

export function CategoryShowcase() {
  return (
    <section id="shop" className="bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            SHOP BY CATEGORY
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gold" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.path}
              className="group relative flex animate-in cursor-pointer flex-col items-center rounded-xl border border-border bg-card p-5 text-center transition-all duration-300 fade-in slide-in-from-bottom-4 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] sm:p-6 md:p-8"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="mb-4 transform text-4xl transition-transform duration-300 group-hover:scale-110 md:mb-6 md:text-6xl">
                {category.icon}
              </div>
              <h3 className="mb-3 line-clamp-2 font-display text-base font-bold sm:mb-4 sm:text-lg md:text-xl">
                {category.name}
              </h3>
              <div className="mt-auto flex items-center font-medium text-gold transition-colors group-hover:text-gold-hover">
                <span className="mr-2">Shop</span>
                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
