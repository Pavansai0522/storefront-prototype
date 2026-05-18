import React from 'react';
import { Quote, Star } from 'lucide-react';
const testimonials = [
{
  id: 1,
  text: 'Best selection in town! Always find what I need. The staff is incredibly knowledgeable about their whiskey collection.',
  author: 'Mike R.',
  rating: 5
},
{
  id: 2,
  text: 'Great prices and super friendly staff. They helped me pick out the perfect wine for our anniversary dinner.',
  author: 'Sarah K.',
  rating: 5
},
{
  id: 3,
  text: 'Same day delivery is a game changer! Ordered for a last-minute party and everything arrived perfectly chilled.',
  author: 'James T.',
  rating: 5
}];

export function Testimonials() {
  return (
    <section className="py-24 bg-card border-t border-border relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) =>
          <div
            key={testimonial.id}
            className="bg-background p-8 rounded-2xl border border-border relative group hover:border-gold/50 transition-colors duration-300">
            
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/10 group-hover:text-gold/20 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) =>
              <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              )}
              </div>

              <p className="text-lg text-muted mb-8 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-card border border-gold/30 flex items-center justify-center text-gold font-bold font-display">
                  {testimonial.author.charAt(0)}
                </div>
                <span className="font-bold text-foreground">
                  {testimonial.author}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}