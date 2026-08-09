import React from 'react';
import { Hero } from '../components/Hero';
import { MenuHighlights } from '../components/MenuHighlights';
import { AlsoHereSection } from '../components/AlsoHereSection';
import { VisitUs } from '../components/VisitUs';

export function Home(): JSX.Element {
  return (
    <main>
      <Hero />
      <MenuHighlights />
      <AlsoHereSection />
      <VisitUs />
    </main>
  );
}
