import React from 'react';
import { Trophy, Tag, Sparkles, Users } from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'Largest Selection',
    description: '5,000+ products in store',
  },
  {
    icon: Tag,
    title: 'Best Prices',
    description: 'Competitive everyday pricing',
  },
  {
    icon: Sparkles,
    title: 'Weekly Specials',
    description: 'Fresh deals on spirits, wine & beer',
  },
  {
    icon: Users,
    title: 'Expert Staff',
    description: 'Knowledgeable team ready to help',
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-card py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 p-2 text-center sm:space-y-4 sm:p-4"
            >
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-gold/10 sm:mb-2 sm:h-16 sm:w-16">
                <feature.icon className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-display text-base font-bold sm:text-lg">{feature.title}</h3>
              <p className="max-w-xs text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
