import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';
import { phoneTelHref } from '../utils/phoneTel';
import { SocialLinksRow } from './SocialLinksRow';

export function VisitUs(): JSX.Element {
  const clientConfig = useStoreConfig();
  const telHref = phoneTelHref(clientConfig.contact.phoneDisplay);

  return (
    <section id="visit" className="relative overflow-x-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="min-w-0 max-w-3xl"
        >
          <h2 className="mb-6 break-words font-display text-4xl uppercase tracking-tight text-brand-text md:text-5xl lg:text-6xl">
            Visit Our <span className="text-brand-blue">Store</span>
          </h2>
          <p className="mb-10 text-base text-brand-muted md:text-lg">
            Experience the latest tech hands-on. Drop by for a coffee, check out new phones, or get
            your device fixed by experts.
          </p>

          <div className="w-full space-y-8">
            <div className="flex items-start gap-4">
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

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-card">
                <Clock className="h-6 w-6 text-brand-blue" aria-hidden />
              </div>
              <div className="min-w-0">
                <h4 className="mb-2 text-xl font-bold text-brand-text">Opening Hours</h4>
                <p className="text-brand-muted">Monday - Sunday</p>
                <p className="font-medium text-brand-text">10:30 AM - 9:30 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
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
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(29,78,216,0.25)] transition-colors hover:bg-brand-blueHover"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
              Open in Google Maps
            </a>

            <div>
              <h4 className="mb-3 text-lg font-bold text-brand-text">Follow us</h4>
              <SocialLinksRow />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
