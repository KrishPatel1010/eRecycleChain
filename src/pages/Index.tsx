import * as React from "react"
import { Navigation } from '../components/Navigation';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { BlockchainFeatures } from '../components/BlockchainFeatures';
import { ImpactSection } from '../components/ImpactSection';
import { NetworkSection } from '../components/NetworkSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <BlockchainFeatures />
      <ImpactSection />
      <NetworkSection />
    </div>
  );
};

export default Index;
