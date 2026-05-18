import React from 'react';
import { STORE_PHONE_DISPLAY, STORE_PHONE_TEL } from '../config/store';

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      
      <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl animate-in slide-in-from-left-8 duration-700 fade-in">
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            YOUR CITY'S FINEST <span className="text-gold">SPIRITS</span>
          </h1>

          <p className="text-xl text-muted leading-relaxed">
            Premium wines, craft spirits, imported beers — curated for every
            occasion. Discover our exceptional collection today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-8 py-4 bg-gold hover:bg-gold-hover text-background font-bold rounded transition-colors duration-300 min-h-[44px] text-lg">
              Shop Now
            </button>
            <a
              href={STORE_PHONE_TEL}
              className="px-8 py-4 border border-gold text-gold hover:bg-gold/10 font-bold rounded transition-colors duration-300 min-h-[44px] text-lg text-center flex items-center justify-center">
              
              Call {STORE_PHONE_DISPLAY}
            </a>
          </div>
        </div>

        <div className="relative h-[500px] md:h-[700px] w-full animate-in slide-in-from-right-8 duration-700 fade-in delay-200">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent rounded-full blur-3xl opacity-30"></div>

          <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Premium liquor bottles arrangement"
              className="w-full h-full object-cover object-center" />
            
          </div>
        </div>
      </div>
    </section>);

}