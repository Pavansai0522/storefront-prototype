import React from 'react';
import { Link } from 'react-router-dom';

type ToySubcategoryLayoutProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function ToySubcategoryLayout({
  title,
  description,
  children,
}: ToySubcategoryLayoutProps): JSX.Element {
  return (
    <div className="min-h-[80vh] bg-brand-bg pb-16 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/toys"
          className="mb-8 inline-flex min-h-[44px] items-center rounded-md text-sm font-medium text-brand-purple transition-colors hover:text-brand-purple/80 focus:outline-none focus:ring-2 focus:ring-brand-purple"
        >
          ← Back to Toys
        </Link>
        <h1 className="font-bebas text-4xl tracking-wide text-brand-text md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-brand-muted">{description}</p>
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </div>
  );
}
