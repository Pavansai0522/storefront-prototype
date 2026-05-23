import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { phoneTelHref } from '../utils/phoneTel';
import { SocialLinksRow } from './SocialLinksRow';
import { StoreLogo } from './StoreLogo';
import { STORE_PANEL_SURFACE, STORE_SECTION_SURFACE } from '../constants/ui';

const CAROUSEL_INTERVAL_MS = 4000;

type StorePhotoCarouselProps = {
  images: readonly string[];
};

function StorePhotoCarousel({ images }: StorePhotoCarouselProps): JSX.Element | null {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  useEffect(() => {
    if (count < 2) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return null;
  }

  const goPrev = (): void => {
    setCurrent((prev) => (prev - 1 + count) % count);
  };

  const goNext = (): void => {
    setCurrent((prev) => (prev + 1) % count);
  };

  return (
    <div
      className={`relative h-[360px] w-full overflow-hidden md:h-[480px] ${STORE_PANEL_SURFACE}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Store photos"
    >
      {images.map((img, i) => (
        <img
          key={img}
          src={img}
          alt={`Bala Mobiles store view ${i + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-text/50 via-transparent to-brand-text/10" />

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bg/25 p-6 backdrop-blur-[1px]">
        <StoreLogo variant="hero" linked={false} />
      </div>

      {count > 1 ? (
        <>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-label={`Show store photo ${i + 1}`}
                aria-current={i === current ? true : undefined}
                onClick={() => setCurrent(i)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${
                    i === current
                      ? 'scale-125 bg-brand-blue shadow-[0_0_8px_rgba(29,78,216,0.6)]'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous store photo"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next store photo"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function VisitUs(): JSX.Element {
  const clientConfig = useStoreConfig();
  const telHref = phoneTelHref(clientConfig.contact.phoneDisplay);
  const storeImages = clientConfig.location.storeCarouselImages;

  return (
    <section id="visit" className={`relative overflow-x-hidden ${STORE_SECTION_SURFACE} py-24`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-w-0 text-center lg:text-left"
          >
            <h2 className="mb-6 break-words font-display text-4xl uppercase tracking-tight text-brand-text md:text-5xl lg:text-6xl">
              Visit Our <span className="text-brand-blue">Store</span>
            </h2>
            <p className="mb-10 text-base text-brand-muted md:text-lg">
              Experience the latest tech hands-on. Drop by for a coffee, check out new phones, or get
              your device fixed by experts.
            </p>

            <div className="mx-auto w-full max-w-md space-y-8 lg:mx-0 lg:max-w-none">
              <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-card">
                  <MapPin className="h-6 w-6 text-brand-blue" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-brand-text">Store Address</h4>
                  <p className="break-words leading-relaxed text-brand-muted">
                    {clientConfig.location.addressLines.map((line, i) => (
                      <React.Fragment key={line}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-card">
                  <Clock className="h-6 w-6 text-brand-blue" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 className="mb-2 text-xl font-bold text-brand-text">Opening Hours</h4>
                  <p className="text-brand-muted">Monday - Sunday</p>
                  <p className="font-medium text-brand-text">10:30 AM - 9:30 PM</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-card">
                  <Phone className="h-6 w-6 text-brand-blue" aria-hidden />
                </div>
                <div className="min-w-0 break-words">
                  <h4 className="mb-2 text-xl font-bold text-brand-text">Contact</h4>
                  {telHref ? (
                    <a href={telHref} className="text-brand-text transition-colors hover:text-brand-blue">
                      {clientConfig.contact.phoneDisplay}
                    </a>
                  ) : (
                    <p className="text-brand-muted">{clientConfig.contact.phoneDisplay}</p>
                  )}
                </div>
              </div>

              <a
                href={clientConfig.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(29,78,216,0.25)] transition-colors hover:bg-brand-blueHover lg:mx-0"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                Open in Google Maps
              </a>

              <div>
                <h4 className="mb-3 text-lg font-bold text-brand-text">Follow us</h4>
                <SocialLinksRow className="flex flex-wrap justify-center gap-3 lg:justify-start" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="min-w-0"
          >
            <StorePhotoCarousel images={storeImages} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
