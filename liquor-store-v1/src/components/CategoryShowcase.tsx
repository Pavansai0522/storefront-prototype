import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const categories = [
{
  name: 'Whisky & Bourbon',
  icon: '🥃',
  path: '/spirits'
},
{
  name: 'Scotch',
  icon: '🥃',
  path: '/spirits'
},
{
  name: 'Rare Bottles',
  icon: '💎',
  path: '/spirits'
},
{
  name: 'Wine & Champagne',
  icon: '🍷',
  path: '/wine'
},
{
  name: 'Vodka & Gin',
  icon: '🍸',
  path: '/spirits'
},
{
  name: 'Beer & Craft',
  icon: '🍺',
  path: '/beer'
},
{
  name: 'Tequila & Mezcal',
  icon: '🌵',
  path: '/spirits'
},
{
  name: 'Rum & Brandy',
  icon: '🥂',
  path: '/spirits'
}];

export function CategoryShowcase() {
  return (
    <section id="shop" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            SHOP BY CATEGORY
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map((category, index) =>
          <Link
            key={category.name}
            to={category.path}
            className="group relative bg-card border border-border rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}>
            
              <div className="text-5xl md:text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-4">
                {category.name}
              </h3>
              <div className="mt-auto flex items-center text-gold font-medium group-hover:text-gold-hover transition-colors">
                <span className="mr-2">Shop</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>);

}