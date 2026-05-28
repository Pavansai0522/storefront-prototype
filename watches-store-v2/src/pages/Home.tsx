import React from 'react';
import { Hero } from '../components/Hero';
import { OffersBanner } from '../components/OffersBanner';
import { Categories } from '../components/Categories';
import { FeaturedWatches } from '../components/FeaturedWatches';
import { FeaturedToys } from '../components/FeaturedToys';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { VisitUs } from '../components/VisitUs';
import { SocialProof } from '../components/SocialProof';

export function Home(): JSX.Element {
  return (
    <div className="bg-brand-bg">
      <Hero />
      <OffersBanner />
      <Categories />
      <FeaturedWatches />
      <FeaturedToys />
      <WhyChooseUs />
      <VisitUs />
      <SocialProof />
    </div>
  );
}
