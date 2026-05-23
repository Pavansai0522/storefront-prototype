import React from 'react';
import { Instagram } from 'lucide-react';
import { useStoreConfig } from '../context/StoreDataContext';

export function InstagramStrip(): JSX.Element {
  const { social } = useStoreConfig();

  return (
    <section className="overflow-x-hidden bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] py-12">
      <div className="mx-auto flex max-w-7xl flex-col flex-wrap items-center justify-between gap-4 px-4 sm:flex-row md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Instagram className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="text-lg font-bold leading-tight text-white">{social.instagramHandle}</h3>
            <p className="text-sm text-white/90">Follow us for daily deals and unboxings</p>
          </div>
        </div>
        <a
          href={social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#ee2a7b] transition-colors hover:bg-white/90"
        >
          Follow on Instagram
        </a>
      </div>
    </section>
  );
}
