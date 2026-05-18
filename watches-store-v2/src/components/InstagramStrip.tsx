import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { clientConfig } from '../config/client-config';
import { btnShop } from '../constants/buttonStyles';

const POSTS = clientConfig.location.storeCarouselImages.concat([
  'https://images.unsplash.com/photo-1584302360444-1453c11c9c8f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
]);

export function InstagramStrip(): JSX.Element {
  const { instagramHandle, instagramUrl } = clientConfig.social;

  return (
    <section className="border-y border-brand-border bg-brand-bg py-12 md:py-16">
      <div className="container mx-auto mb-8 flex flex-col flex-wrap items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-bg">
              <Instagram className="h-5 w-5 text-white" aria-hidden />
            </div>
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="text-lg font-bold leading-tight text-brand-text">{instagramHandle}</h3>
            <p className="text-sm text-brand-muted">New arrivals, festival offers & unboxings</p>
          </div>
        </div>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnShop} !min-h-[44px] !px-6 !py-2.5 !text-sm`}
        >
          Follow Us
        </a>
      </div>

      <div className="scroll-rail w-full overflow-x-auto overflow-y-visible overscroll-x-contain touch-pan-x snap-x snap-mandatory md:overflow-visible md:snap-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex w-max gap-3 sm:gap-4 md:w-full md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-6">
            {POSTS.map((img, index) => (
              <motion.a
                href={instagramUrl}
                key={`${img}-${index}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group relative h-44 w-44 shrink-0 snap-center overflow-hidden rounded-xl border border-brand-border sm:h-52 sm:w-52 md:h-56 md:w-full md:snap-none md:shrink"
              >
                <img
                  src={img}
                  alt={`${instagramHandle} post ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="h-10 w-10 text-white" aria-hidden />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
