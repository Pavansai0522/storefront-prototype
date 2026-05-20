import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_PHONE_DISPLAY,
  STORE_PHONE_TEL,
} from '../config/store';

const STORE_IMAGE = {
  src: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  alt: 'Premium spirits on display at United Liquors',
} as const;

export function VisitUs() {
  return (
    <section id="visit-us" className="bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">
            VISIT OUR STORE
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gold" />
        </div>

        <div className="grid items-stretch gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-5 sm:p-6 md:p-8">
            <h3 className="mb-4 shrink-0 font-display text-xl font-bold text-gold sm:text-2xl md:mb-5">
              United Liquors
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <h4 className="mb-0.5 text-base font-bold">Address</h4>
                  <p className="text-sm text-muted">
                    {STORE_ADDRESS_LINE1}
                    <br />
                    {STORE_ADDRESS_LINE2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0 flex-1">
                  <h4 className="mb-0.5 text-base font-bold">Hours</h4>
                  <ul className="space-y-1 text-sm text-muted">
                    {STORE_HOURS.map((row) => (
                      <li
                        key={row.label}
                        className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-3"
                      >
                        <span className="shrink-0">{row.label}</span>
                        <span className="sm:text-right">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <h4 className="mb-0.5 text-base font-bold">Phone</h4>
                    <a
                      href={STORE_PHONE_TEL}
                      className="inline-flex min-h-[44px] items-center py-1 text-sm text-muted transition-colors hover:text-gold"
                    >
                      {STORE_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <h4 className="mb-0.5 text-base font-bold">Email</h4>
                    <a
                      href="mailto:info@unitedliquors.com"
                      className="inline-flex min-h-[44px] items-center break-all py-1 text-sm text-muted transition-colors hover:text-gold"
                    >
                      info@unitedliquors.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-52 min-h-[13rem] overflow-hidden rounded-2xl border border-border sm:h-64 md:h-full md:min-h-[18rem]">
            <img
              src={STORE_IMAGE.src}
              alt={STORE_IMAGE.alt}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
