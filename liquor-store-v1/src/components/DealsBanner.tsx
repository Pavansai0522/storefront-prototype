import React from 'react';
import { ArrowRight } from 'lucide-react';
export function DealsBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-gold-hover via-gold to-gold-hover py-12 px-4 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}>
      </div>

      <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-background">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            🎉 WEEKLY SPECIALS
          </h2>
          <p className="text-lg font-medium opacity-90">
            Up to 30% off select wines every Friday!
          </p>
        </div>

        <button className="flex items-center gap-2 px-8 py-4 bg-background text-foreground hover:bg-card font-bold rounded transition-colors duration-300 min-h-[44px] whitespace-nowrap group shadow-xl">
          See Deals
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>);

}