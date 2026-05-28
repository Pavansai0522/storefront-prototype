import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Quote } from 'lucide-react';
import { clientConfig } from '../config/client-config';
import { facebookUrl, instagramUrl, youtubeUrl } from '../utils/socialLinks';

const REVIEWS = [
  {
    quote: 'Best watch collection in Chilakaluripet. Got my G-Shock with bill and EMI.',
    author: 'Ramesh K.',
  },
  {
    quote: 'Kids toys quality super undi. Birthday gift ki perfect shop.',
    author: 'Lakshmi P.',
  },
  {
    quote: 'WhatsApp lo price chepparu, store lo same rate. Genuine products.',
    author: 'Vijay S.',
  },
];

export function SocialProof(): JSX.Element {
  const facebookHref = facebookUrl();
  return (
    <section className="relative z-10 border-y border-brand-border bg-brand-bg py-16 md:py-20">
      <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div>
            <h3 className="mb-2 font-bebas text-4xl text-brand-purple sm:text-5xl md:text-6xl">5000+</h3>
            <p className="text-base font-medium text-brand-text sm:text-xl">Happy Customers</p>
          </div>
          <div>
            <h3 className="mb-2 font-bebas text-4xl text-brand-purple sm:text-5xl md:text-6xl">500+</h3>
            <p className="text-base font-medium text-brand-text sm:text-xl">Watch Models</p>
          </div>
          <div>
            <h3 className="mb-2 font-bebas text-3xl text-brand-text sm:text-5xl md:text-6xl">
              Since {clientConfig.brand.trustedSince}
            </h3>
            <p className="text-base font-medium text-brand-text sm:text-xl">Serving Chilakaluripet</p>
          </div>
        </motion.div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review, index) => (
            <motion.blockquote
              key={review.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-brand-border bg-brand-card p-6 text-left"
            >
              <Quote className="mb-3 h-6 w-6 text-brand-purple" aria-hidden />
              <p className="mb-4 text-sm leading-relaxed text-brand-text">&ldquo;{review.quote}&rdquo;</p>
              <footer className="text-sm font-semibold text-brand-text">— {review.author}</footer>
            </motion.blockquote>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="mb-8 text-lg text-brand-text">
            Chilakaluripet&apos;s trusted destination for watches, toys & mobiles
          </p>

          <div className="flex justify-center gap-6">
            <a
              href={instagramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text transition-all hover:-translate-y-1 hover:border-brand-purple hover:text-brand-purple hover:shadow-md"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={youtubeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text transition-all hover:-translate-y-1 hover:border-brand-purple hover:text-brand-purple hover:shadow-md"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
            {facebookHref ? (
              <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text transition-all hover:-translate-y-1 hover:border-brand-purple hover:text-brand-purple hover:shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
