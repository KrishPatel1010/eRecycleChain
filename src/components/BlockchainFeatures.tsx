import * as React from "react"
import { Shield, Link, Award, TrendingUp, Database, Network } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const BlockchainFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: 'Immutable Ledger',
      description: 'Every recycling transaction is permanently recorded on our distributed blockchain network.',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: Link,
      title: 'Smart Contracts',
      description: 'Automated verification and reward distribution through decentralized smart contracts.',
      gradient: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Award,
      title: 'NFT Certificates',
      description: 'Receive unique NFT certificates proving your environmental contribution and impact.',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Impact Analytics',
      description: 'Real-time blockchain analytics tracking global environmental impact metrics.',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section id="blockchain" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Blockchain Network Background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900"></div>
        {/* Network Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 md:mb-6">
            Blockchain-Powered{' '}
            <span className="text-gradient-blockchain">
              Infrastructure
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
            Our decentralized network ensures complete transparency, security, and trust
            in every e-waste recycling transaction through cutting-edge blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border-slate-300 dark:border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4 md:p-6 text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 animate-blockchain-pulse`}>
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-semibold mb-2 md:mb-3 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blockchain Network Visualization */}
        <div className="relative bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-300 dark:border-slate-700">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">Live Network Status</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">Real-time blockchain network activity</p>
          </div>

          <div className="flex items-center justify-center space-x-4 md:space-x-8 overflow-hidden">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-md md:rounded-lg flex items-center justify-center mb-2 animate-blockchain-pulse ${index === 2 ? 'pulse-glow' : ''}`}>
                  <Database className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Node {index + 1}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">{Math.floor(Math.random() * 1000)}ms</div>
                {index < 4 && (
                  <div className="absolute top-6 md:top-8 w-4 md:w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 animate-network-flow hidden sm:block" style={{ left: `${20 + index * 25}%` }}></div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            {[
              { label: 'Network Hash Rate', value: '2.5 TH/s', color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Active Validators', value: '156', color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Block Height', value: '1,247,891', color: 'text-purple-600 dark:text-purple-400' },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-slate-100 dark:bg-slate-900/60 rounded-lg p-3 md:p-4">
                <div className={`text-xl md:text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-400 text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
