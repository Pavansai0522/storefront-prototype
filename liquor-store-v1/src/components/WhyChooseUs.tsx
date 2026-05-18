import React from 'react';
import { Trophy, Tag, Truck, Users } from 'lucide-react';
const features = [
{
  icon: Trophy,
  title: 'Largest Selection',
  description: '5,000+ products in store'
},
{
  icon: Tag,
  title: 'Best Prices',
  description: 'Price match guarantee'
},
{
  icon: Truck,
  title: 'Fast Delivery',
  description: 'Same day delivery available'
},
{
  icon: Users,
  title: 'Expert Staff',
  description: 'Knowledgeable team ready to help'
}];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) =>
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-4 p-4">
            
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 mb-2">
                <feature.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-lg font-display font-bold">
                {feature.title}
              </h3>
              <p className="text-sm text-muted">{feature.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}