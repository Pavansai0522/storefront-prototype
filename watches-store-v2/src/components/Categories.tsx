import React from 'react';
import { motion } from 'framer-motion';
import { Watch, Headphones, Cable, Clock, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';
const categories = [
{
  name: 'Luxury Watches',
  icon: Watch,
  href: '/watches/dial'
},
{
  name: 'Smart Watches',
  icon: Clock,
  href: '/watches/smart'
},
{
  name: 'Toys',
  icon: Gamepad2,
  href: '/toys'
},
{
  name: 'Audio & Earphones',
  icon: Headphones,
  href: '/accessories/headphones'
},
{
  name: 'Accessories & Cables',
  icon: Cable,
  href: '/accessories/cables'
}];

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};
export function Categories() {
  return (
    <section
      id="categories"
      className="py-16 md:py-20 bg-brand-bg relative z-10">
      
      <div className="storefront-shell">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-12">
          
          <h2 className="font-bebas text-4xl font-normal md:text-5xl text-black tracking-wide">
            SHOP BY CATEGORY
          </h2>
          <div className="w-24 h-1 bg-brand-purple mx-auto mt-4 rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.name} variants={itemVariants}>
                <Link
                  to={category.href}
                  className="group relative flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-brand-purple/20 bg-brand-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/30 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-brand-purple sm:min-h-[140px] sm:p-6">
                  
                  <Icon className="mb-3 h-9 w-9 text-brand-purple transition-transform group-hover:scale-110 sm:mb-4 sm:h-12 sm:w-12" />
                  <h3 className="mb-1 line-clamp-2 text-center font-bebas text-base font-normal tracking-wide text-black sm:mb-2 sm:text-xl">
                    {category.name}
                  </h3>
                  <span className="text-sm text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-medium">
                    Explore <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </motion.div>);

          })}
        </motion.div>
      </div>
    </section>);

}