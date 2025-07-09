import React from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, Network, Database } from 'lucide-react';
import { useReadContract } from 'wagmi';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { polygonAmoy } from 'wagmi/chains';

export const DashboardHero = () => {
  // Fetch total item count from contract
  const { data: itemCount, isLoading: isLoadingCount, isError: isErrorCount } = useReadContract({
    address: (import.meta as any).env.VITE_TRACKER_ADDRESS,
    abi: EwasteTrackerABI.abi,
    functionName: 'itemCounter',
    chainId: polygonAmoy.id,
  });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 blockchain-network">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full animate-blockchain-pulse"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in-up leading-tight">
            E-Waste{' '}
            <span
              className="text-gradient-blockchain text-gradient-fix inline-block align-baseline"
            >
              Mining
            </span>{' '}
            Dashboard
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Submit your electronic waste, verify transactions, and earn RECY tokens through our blockchain network.
          </p>

          {/* Connect Wallet Button */}
          <div className="mb-8 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <ConnectButton />
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Network, label: 'Active Nodes', value: '1,247', color: 'text-blue-500' },
              {
                icon: Database,
                label: 'Total Submissions',
                value: isLoadingCount ? 'Loading...' : isErrorCount ? 'Error' : (itemCount !== undefined && !isNaN(Number(itemCount)) ? (Number(itemCount) + 1).toString() : '1'),
                color: 'text-cyan-500',
              },
              { icon: Wallet, label: 'RECY Distributed', value: '₹2.4Cr', color: 'text-purple-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-300 dark:border-slate-700">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
