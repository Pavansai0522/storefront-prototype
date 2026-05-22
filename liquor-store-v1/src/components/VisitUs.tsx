import React, { useEffect, useState, type ReactNode } from 'react';
import { MapPin, Clock, Phone, Mail, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { STORE_CAROUSEL_ALT, STORE_CAROUSEL_IMAGES, STORE_NAME } from '../config/storeBranding';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';

type VisitInfoItemProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

function StorePhotoCarousel(): JSX.Element {
  const [current, setCurrent] = useState(0);
  const count = STORE_CAROUSEL_IMAGES.length;

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 4000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div
      className="relative min-h-[14rem] w-full overflow-hidden rounded-2xl border border-border md:min-h-0 md:h-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Store photos"
    >
      {STORE_CAROUSEL_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${STORE_CAROUSEL_ALT} ${i + 1} of ${count}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" aria-hidden />

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {STORE_CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show store photo ${i + 1}`}
            aria-current={i === current ? true : undefined}
            onClick={() => setCurrent(i)}
            className={`h-2 min-h-[20px] w-2 min-w-[20px] rounded-full transition-all duration-300 ${
              i === current ? 'scale-110 bg-gold' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous store photo"
        onClick={() => setCurrent((p) => (p - 1 + count) % count)}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors duration-200 hover:bg-black/60"
      >
        <ChevronLeft size={18} className="text-white" aria-hidden />
      </button>

      <button
        type="button"
        aria-label="Next store photo"
        onClick={() => setCurrent((p) => (p + 1) % count)}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 transition-colors duration-200 hover:bg-black/60"
      >
        <ChevronRight size={18} className="text-white" aria-hidden />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-10 pt-8">
        <p className="font-display text-lg font-bold text-white">{STORE_NAME}</p>
        <p className="text-xs text-white/70">New Lenox, IL</p>
      </div>
    </div>
  );
}

function VisitInfoItem({ icon: Icon, title, children }: VisitInfoItemProps): JSX.Element {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
        <Icon className="h-5 w-5 text-gold" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h4 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h4>
        <div className="text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

export function VisitUs(): JSX.Element {
  const { clientConfig } = useStoreData();

  return (
    <section id="visit-us" className="bg-background py-16 sm:py-20">
      <div className="container mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            VISIT OUR STORE
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gold" />
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          {/* Store info — balanced padding and consistent info rows */}
          <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 md:justify-center md:p-8">
            <h3 className="mb-6 font-display text-xl font-bold text-gold sm:text-2xl">
              {clientConfig.storeName}
            </h3>

            <div className="flex flex-col gap-6">
              <VisitInfoItem icon={MapPin} title="Address">
                <p>
                  {STORE_ADDRESS_LINE1}
                  <br />
                  {STORE_ADDRESS_LINE2}
                </p>
              </VisitInfoItem>

              <div className="grid gap-6 border-t border-border/50 pt-6 sm:grid-cols-2 sm:gap-8 md:pt-6">
                <div className="border-b border-border/50 pb-6 md:border-b-0 md:pb-0">
                  <VisitInfoItem icon={Clock} title="Hours">
                    <ul className="space-y-2">
                      {STORE_HOURS.map((row) => (
                        <li
                          key={row.label}
                          className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                        >
                          <span className="shrink-0 font-medium text-foreground/90">{row.label}</span>
                          <span className="sm:text-right">{row.time}</span>
                        </li>
                      ))}
                    </ul>
                  </VisitInfoItem>
                </div>

                <div className="flex flex-col gap-6 pt-6 md:pt-0">
                  <VisitInfoItem icon={Phone} title="Phone">
                    <a
                      href={STORE_PHONE_TEL}
                      className="inline-block transition-colors hover:text-gold"
                    >
                      {STORE_PHONE_DISPLAY}
                    </a>
                  </VisitInfoItem>

                  <VisitInfoItem icon={Mail} title="Email">
                    <a
                      href={`mailto:${clientConfig.email}`}
                      className="break-all transition-colors hover:text-gold"
                    >
                      {clientConfig.email}
                    </a>
                  </VisitInfoItem>
                </div>
              </div>
            </div>
          </div>

          <StorePhotoCarousel />
        </div>
      </div>
    </section>
  );
}
