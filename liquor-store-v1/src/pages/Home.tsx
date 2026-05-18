import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { DealsBanner } from '../components/DealsBanner';
import { VisitUs } from '../components/VisitUs';
import { Testimonials } from '../components/Testimonials';
export function Home() {
  return (
    <main>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <WhyChooseUs />
      <DealsBanner />
      <VisitUs />
      <Testimonials />
    </main>);

}