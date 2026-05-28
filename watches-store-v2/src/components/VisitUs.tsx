import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { clientConfig, whatsappHref } from '../config/client-config';
import { btnWhatsApp } from '../constants/buttonStyles';
import { StoreLogo } from './StoreLogo';

const storeImages = clientConfig.location.storeCarouselImages;

function StorePhotoCarousel(): JSX.Element {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % storeImages.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative h-[min(400px,70vw)] w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-surface sm:rounded-3xl sm:h-[400px] md:h-[500px]"
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
            i === current ? 'opacity-80' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <StoreLogo variant="hero" linked={false} />
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        {storeImages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show store photo ${i + 1}`}
            aria-current={i === current ? true : undefined}
            onClick={() => setCurrent(i)}
            className="flex h-11 w-11 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all ${
                i === current
                  ? 'h-3 w-3 bg-brand-purple'
                  : 'h-2 w-2 bg-brand-text/30 hover:bg-brand-text/50'
              }`}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous store photo"
        onClick={() => setCurrent((p) => (p - 1 + storeImages.length) % storeImages.length)}
        className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-bg/90 text-brand-text shadow-sm hover:bg-brand-bg sm:left-3"
      >
        <ChevronLeft size={18} className="text-brand-text" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next store photo"
        onClick={() => setCurrent((p) => (p + 1) % storeImages.length)}
        className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-bg/90 text-brand-text shadow-sm hover:bg-brand-bg sm:right-3"
      >
        <ChevronRight size={18} className="text-brand-text" aria-hidden />
      </button>
    </div>
  );
}

export function VisitUs(): JSX.Element {
  const handleChatClick = (): void => {
    toast.success('Opening WhatsApp...');
  };

  return (
    <section id="visit" className="relative z-10 bg-brand-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 font-bebas text-4xl font-normal tracking-wide text-black md:text-5xl">
              VISIT OUR STORE
            </h2>

            <div className="mb-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                  <MapPin className="h-6 w-6 text-brand-purple" aria-hidden />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-brand-text">Location</h4>
                  <p className="leading-relaxed text-brand-text">
                    {clientConfig.location.addressLines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <a
                    href={clientConfig.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-purple hover:underline"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                  <Phone className="h-6 w-6 text-brand-purple" aria-hidden />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-brand-text">Phone / WhatsApp</h4>
                  <p className="text-brand-text">{clientConfig.contact.phoneDisplay}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface">
                  <Clock className="h-6 w-6 text-brand-purple" aria-hidden />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-semibold text-brand-text">Hours</h4>
                  <p className="text-brand-text">{clientConfig.hours.weekdays}</p>
                  <p className="text-brand-text">{clientConfig.hours.sunday}</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleChatClick}
              className={`${btnWhatsApp} w-full sm:w-auto`}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Chat with Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <StorePhotoCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
