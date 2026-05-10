import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { clientConfig } from '../config/client-config';

const storeImages = clientConfig.location.storeCarouselImages;

function StorePhotoCarousel(): JSX.Element {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % storeImages.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative h-56 w-full min-h-[280px] overflow-hidden rounded-2xl border border-white/10 sm:h-72 md:h-full md:min-h-[400px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Store photos"
    >
      {storeImages.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`Store view ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {storeImages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show store photo ${i + 1}`}
            aria-current={i === current ? true : undefined}
            onClick={() => setCurrent(i)}
            className={`h-2 min-h-[20px] w-2 min-w-[20px] rounded-full transition-all duration-300 ${
              i === current
                ? 'scale-110 bg-brand-saffron'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous store photo"
        onClick={() => setCurrent((p) => (p - 1 + storeImages.length) % storeImages.length)}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors duration-200 hover:bg-black/60"
      >
        <ChevronLeft size={18} className="text-white" aria-hidden />
      </button>

      <button
        type="button"
        aria-label="Next store photo"
        onClick={() => setCurrent((p) => (p + 1) % storeImages.length)}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors duration-200 hover:bg-black/60"
      >
        <ChevronRight size={18} className="text-white" aria-hidden />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-4 pb-10 pt-8">
        <p className="font-display text-lg text-white">{clientConfig.location.mapCardTitle}</p>
        <p className="text-xs text-white/60">{clientConfig.location.mapCardSubtitle}</p>
      </div>
    </div>
  );
}

export function VisitUs() {
  return (
    <section id="visit" className="relative overflow-x-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="min-w-0"
          >
            <h2 className="mb-6 break-words font-display text-4xl uppercase tracking-tight text-white md:text-5xl lg:text-6xl">
              Visit Our <span className="text-brand-saffron">Store</span>
            </h2>
            <p className="mb-10 text-base text-gray-400 md:text-lg">
              Experience the latest tech hands-on. Drop by for a coffee, check out new phones, or get
              your device fixed by experts.
            </p>

            <div className="w-full space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <MapPin className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-white">Store Address</h4>
                  <p className="break-words leading-relaxed text-gray-400">
                    {clientConfig.location.addressLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <Clock className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-white">Opening Hours</h4>
                  <p className="text-gray-400">Monday - Sunday</p>
                  <p className="font-medium text-white">10:30 AM - 9:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/5 bg-brand-card">
                  <Phone className="h-6 w-6 text-brand-saffron" aria-hidden />
                </div>
                <div className="min-w-0 break-words">
                  <h4 className="mb-2 text-xl font-bold text-white">Contact</h4>
                  <p className="text-gray-400">{clientConfig.contact.phoneDisplay}</p>
                  <p className="text-gray-400">{clientConfig.contact.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full md:min-h-[400px]"
          >
            <StorePhotoCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
