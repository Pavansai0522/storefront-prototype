import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedPhones } from '../components/FeaturedPhones';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { SocialProof } from '../components/SocialProof';
import { Services } from '../components/Services';
import { VisitUs } from '../components/VisitUs';
import { Footer } from '../components/Footer';
import { WhatsAppFAB } from '../components/WhatsAppFAB';
export function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-bg text-brand-text selection:bg-brand-saffron selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedPhones />
        <WhyChooseUs />
        <SocialProof />
        <Services />
        <VisitUs />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>);

}