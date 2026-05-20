import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function DealsBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-gold-hover via-gold to-gold-hover px-4 py-10 sm:py-12">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="container relative z-10 mx-auto flex flex-col items-center justify-between gap-6 text-background md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="mb-2 font-display text-xl font-bold sm:text-2xl md:text-3xl">
            🎉 WEEKLY SPECIALS
          </h2>
          <p className="text-base font-medium opacity-90 sm:text-lg">
            Up to 30% off select wines every Friday!
          </p>
        </div>

        <Link
          to="/deals"
          className="group flex min-h-[44px] w-full max-w-xs items-center justify-center gap-2 rounded bg-background px-8 py-4 font-bold text-foreground shadow-xl transition-colors duration-300 hover:bg-card sm:w-auto md:max-w-none"
        >
          See Deals
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
