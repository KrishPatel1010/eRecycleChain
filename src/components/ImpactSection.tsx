import * as React from "react"
import { useState, useEffect } from 'react';
import { Leaf, Zap, Droplets, Globe, Database, Network } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const ImpactSection = () => {
  const [counters, setCounters] = useState({
    co2Saved: 0,
    energySaved: 0,
    waterSaved: 0,
    devicesRecycled: 0,
  });

  const finalValues = {
    co2Saved: 2500,
    energySaved: 15000,
    waterSaved: 50000,
    devicesRecycled: 125000,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        co2Saved: Math.min(prev.co2Saved + finalValues.co2Saved / steps, finalValues.co2Saved),
        energySaved: Math.min(prev.energySaved + finalValues.energySaved / steps, finalValues.energySaved),
        waterSaved: Math.min(prev.waterSaved + finalValues.waterSaved / steps, finalValues.waterSaved),
        devicesRecycled: Math.min(prev.devicesRecycled + finalValues.devicesRecycled / steps, finalValues.devicesRecycled),
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const impactStats = [
    {
      icon: Leaf,
      value: Math.floor(counters.co2Saved),
      unit: 'tons',
      label: 'CO₂ Emissions Saved',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10 dark:bg-green-500/20',
      description: 'Verified on blockchain',
    },
    {
      icon: Zap,
      value: Math.floor(counters.energySaved),
      unit: 'MWh',
      label: 'Energy Conserved',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      description: 'Smart contract validated',
    },
    {
      icon: Droplets,
      value: Math.floor(counters.waterSaved),
      unit: 'liters',
      label: 'Water Saved',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
      description: 'Immutably recorded',
    },
    {
      icon: Globe,
      value: Math.floor(counters.devicesRecycled),
      unit: '+',
      label: 'Devices Tokenized',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
      description: 'NFT certificates issued',
    },
  ];

  return (
    <section id="impact" className="py-16 md:py-20 bg-gradient-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 md:mb-6 text-gradient-blockchain">
            Blockchain-Verified Impact
          </h2>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
            Every environmental impact metric is cryptographically verified and stored 
            on our decentralized network, ensuring complete transparency and immutability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {impactStats.map((stat, index) => (
            <Card 
              key={index} 
              className="text-center bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-300 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 ${stat.bgColor} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 animate-blockchain-pulse`}>
                  <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color} mb-2 font-mono`}>
                  {stat.value.toLocaleString()}{stat.unit}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blockchain Analytics Dashboard */}
        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-slate-300 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
            <h3 className="text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
              <Database className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400 mr-2" />
              Network Analytics
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 text-sm font-mono">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {[
              { label: 'Network Consensus', percentage: 98, color: 'bg-green-500' },
              { label: 'Smart Contract Execution', percentage: 87, color: 'bg-blue-500' },
              { label: 'Token Distribution', percentage: 94, color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                  <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-slate-300 dark:text-slate-600"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${item.percentage * 0.628} 62.8`}
                      className={item.color === 'bg-green-500' ? 'text-green-500' : item.color === 'bg-blue-500' ? 'text-blue-500' : 'text-purple-500'}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-mono">{item.percentage}%</span>
                  </div>
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-300 text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
