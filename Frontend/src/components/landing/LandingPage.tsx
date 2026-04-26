'use client';
import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      id="landing-page"
      style={{
        minHeight: '100vh',
        background: '#fff',
        color: '#0f172a',
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};
