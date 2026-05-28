import React from 'react';
import { Link } from 'react-router-dom';

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/accessories"
          className="mb-8 inline-flex min-h-[44px] items-center text-sm font-medium text-brand-purple transition-colors hover:text-brand-purple/80"
        >
          ← Back to Accessories
        </Link>
        <h1 className="font-bebas text-4xl font-normal tracking-wide text-black md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-normal text-black">{description}</p>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </div>
  );
}
