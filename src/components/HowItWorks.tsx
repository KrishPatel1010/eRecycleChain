import * as React from "react"
import { Smartphone, Shield, Coins, Recycle, Database, Network } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Smartphone,
      title: 'Submit to Network',
      description: 'Upload device details to our decentralized network with blockchain verification.',
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
      delay: 0,
    },
    {
      icon: Shield,
      title: 'Smart Contract Validation',
      description: 'Automated smart contracts verify authenticity and calculate environmental tokens.',
      color: 'bg-purple-100',
      iconColor: 'text-purple-500',
      delay: 0.2,
    },
    {
      icon: Recycle,
      title: 'Certified Processing',
      description: 'Network-verified recycling partners process e-waste with blockchain tracking.',
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      delay: 0.4,
    },
    {
      icon: Coins,
      title: 'Mine Rewards',
      description: 'Earn cryptocurrency tokens and NFT certificates for contributing to the ecosystem.',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      delay: 0.6,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-20 bg-slate-100 dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 md:mb-6 text-gradient-blockchain">
            Decentralized Process
          </h2>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
            Our blockchain-powered platform creates a trustless, transparent ecosystem
            where every e-waste transaction is verified and rewarded automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white/80 dark:bg-slate-900/60 border-slate-300 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up group"
              style={{ animationDelay: `${step.delay}s` }}
            >
              <CardContent className="p-6 md:p-8 text-center">
                {/* Step Number */}
                <div className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 md:w-16 md:h-16 ${step.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 animate-blockchain-pulse`}>
                  <step.icon className={`h-6 w-6 md:h-8 md:w-8 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>

                {/* Connecting Line for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-cyan-500 transform -translate-y-1/2 animate-network-flow"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Section */}
        {/* Removed Live Network Demo and Connect Wallet callout */}
      </div>
    </section>
  );
};
