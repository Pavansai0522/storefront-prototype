import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const POSTS = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cd8d3?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=400&q=80'
];

export function InstagramStrip() {
  return (
    <section className="overflow-x-hidden border-y border-white/5 bg-brand-bg py-12">
      <div className="mx-auto mb-8 flex max-w-7xl flex-col flex-wrap items-center justify-between gap-4 px-4 sm:flex-row md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-bg">
              <Instagram className="h-5 w-5 text-white" aria-hidden />
            </div>
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="text-lg font-bold leading-tight text-white">@arudramobiles</h3>
            <p className="text-sm text-gray-400">Follow us for daily deals & unboxings</p>
          </div>
        </div>
        <a
          href="#"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20">
          Follow Us
        </a>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory">
        <div className="flex w-max">
          {POSTS.map((img, index) => (
            <motion.a
              href="#"
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative h-44 w-44 flex-shrink-0 snap-center overflow-hidden sm:h-64 sm:w-64 md:transition-transform"
            >
              <img
                src={img}
                alt="Instagram Post"
                className="h-full w-full object-cover md:transition-transform md:duration-700 md:group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
                <Instagram className="h-10 w-10 text-white" aria-hidden />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
