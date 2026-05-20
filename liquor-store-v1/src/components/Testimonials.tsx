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
  text: 'Stopped in for weekly specials and left with everything for our party. Great selection and fair prices.',
  author: 'James T.',
  rating: 5
}];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-card py-16 md:py-24">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-10 text-center md:mb-16">
          <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial) =>
          <div
            key={testimonial.id}
            className="relative rounded-2xl border border-border bg-background p-6 transition-colors duration-300 group hover:border-gold/50 sm:p-8">
            
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/10 group-hover:text-gold/20 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) =>
              <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              )}
              </div>

              <p className="relative z-10 mb-6 text-base leading-relaxed text-muted sm:mb-8 sm:text-lg">
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