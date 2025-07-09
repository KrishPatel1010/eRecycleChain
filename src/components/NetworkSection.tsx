import * as React from "react"
import { Network, Users, Globe, Zap, Database, Shield } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const NetworkSection = () => {
  const networkStats = [
    { icon: Users, value: '25,000+', label: 'Active Validators', color: 'text-blue-500' },
    { icon: Globe, value: '75', label: 'Countries', color: 'text-green-500' },
    { icon: Zap, value: '99.9%', label: 'Uptime', color: 'text-yellow-500' },
    { icon: Database, value: '2.5M', label: 'Transactions', color: 'text-purple-500' },
  ];

  return (
    <section id="network" className="py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 md:mb-6 text-gradient-blockchain">
            Global Network
          </h2>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
            Join our worldwide network of validators, recyclers, and environmental advocates 
            building the future of sustainable e-waste management.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
          {networkStats.map((stat, index) => (
            <Card key={index} className="text-center bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 md:p-6">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-xl md:text-2xl font-bold ${stat.color} mb-1 md:mb-2 font-mono`}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-heading font-bold text-slate-900 dark:text-white">
                Network Security
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { label: 'Consensus Algorithm', value: 'Proof of Stake', desc: 'Energy efficient validation' },
              { label: 'Block Time', value: '3 seconds', desc: 'Fast transaction processing' },
              { label: 'Finality', value: 'Instant', desc: 'Immediate confirmation' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {item.value}
                </div>
                <div className="font-medium text-slate-900 dark:text-white mb-1">
                  {item.label}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
