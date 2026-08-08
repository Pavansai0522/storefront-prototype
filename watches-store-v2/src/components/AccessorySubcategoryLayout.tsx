import React from 'react';
import { Link } from 'react-router-dom';
import { CatalogSortSlot } from './CatalogSortSlot';

type AccessorySubcategoryLayoutProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function AccessorySubcategoryLayout({
  title,
  description,
  children,
}: AccessorySubcategoryLayoutProps): JSX.Element {
  return (
    <div className="bg-brand-bg pb-16 pt-24">
      <div className="storefront-shell">
        <Link
          to="/accessories"
          className="mb-8 inline-flex min-h-[44px] items-center text-sm font-medium text-brand-purple transition-colors hover:text-brand-purple/80"
        >
          ← Back to Accessories
        </Link>
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <h1 className="font-bebas text-4xl font-normal tracking-wide text-black md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-normal text-black">{description}</p>
          </div>
          <CatalogSortSlot />
        </div>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
