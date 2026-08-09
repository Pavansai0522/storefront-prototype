import React from 'react';
import { MapPin, Clock, Phone, Mail, type LucideIcon } from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { clientConfig } from '../config/client-config';
import { VISIT_US_IMAGE_ALT, VISIT_US_IMAGE_URL } from '../config/storeBranding';
import {
  STORE_ADDRESS_LINE1,
  STORE_ADDRESS_LINE2,
  STORE_HOURS,
  STORE_PHONE_PRIMARY_DISPLAY,
  STORE_PHONE_PRIMARY_TEL,
  STORE_PHONE_SECONDARY_DISPLAY,
  STORE_PHONE_SECONDARY_TEL,
} from '../config/store';

type VisitInfoItemProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
};

function VisitInfoItem({ icon: Icon, title, children }: VisitInfoItemProps): JSX.Element {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
        <Icon className="h-5 w-5 text-gold" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h4 className="mb-1.5 text-sm font-bold uppercase tracking-wide text-foreground">{title}</h4>
        <div className="text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

function VisitPhoto(): JSX.Element {
  return (
    <div className="relative min-h-[16rem] w-full overflow-hidden rounded-2xl border border-gold/25 md:min-h-[20rem]">
      <img
        src={VISIT_US_IMAGE_URL}
        alt={VISIT_US_IMAGE_ALT}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function VisitUs(): JSX.Element {
  const { clientConfig: store } = useStoreData();

  return (
    <section id="visit-us" className="bg-maroon-deep py-16 sm:py-20">
      <div className="container mx-auto">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl md:text-4xl">Visit Us</h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gold" />
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-2xl border border-gold/20 bg-card p-6 md:p-8">
            <h3 className="mb-6 font-display text-xl font-bold text-gold sm:text-2xl">
              {store.storeName}
            </h3>
            <div className="flex flex-col gap-6">
              <VisitInfoItem icon={MapPin} title="Address">
                <p>
                  {STORE_ADDRESS_LINE1}
                  <br />
                  {STORE_ADDRESS_LINE2}
                </p>
              </VisitInfoItem>
              <VisitInfoItem icon={Clock} title="Hours">
                <ul className="space-y-2">
                  {STORE_HOURS.map((row) => (
                    <li key={row.label}>{row.time}</li>
                  ))}
                </ul>
              </VisitInfoItem>
              <VisitInfoItem icon={Phone} title="Reservations & orders">
                <div className="space-y-2">
                  <a
                    href={STORE_PHONE_PRIMARY_TEL}
                    className="block font-semibold tabular-nums text-gold transition hover:underline"
                  >
                    {STORE_PHONE_PRIMARY_DISPLAY}
                    <span className="ml-2 text-xs font-normal text-muted">· also on WhatsApp</span>
                  </a>
                  <a
                    href={STORE_PHONE_SECONDARY_TEL}
                    className="block tabular-nums transition hover:text-gold"
                  >
                    {STORE_PHONE_SECONDARY_DISPLAY}
                  </a>
                </div>
              </VisitInfoItem>
              <VisitInfoItem icon={Mail} title="Email">
                <a href={`mailto:${store.email}`} className="break-all transition hover:text-gold">
                  {store.email}
                </a>
              </VisitInfoItem>
              <p className="text-xs text-muted">Proprietor: {clientConfig.proprietor}</p>
            </div>
          </div>
          <VisitPhoto />
        </div>
      </div>
    </section>
  );
}
