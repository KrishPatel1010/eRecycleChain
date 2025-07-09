import * as React from "react"
import { Cpu, Database, Shield, Zap, Coins, Globe } from 'lucide-react';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating 3D Icons */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="relative">
          <Cpu className="h-12 w-12 text-blue-500/30 floating" style={{ animationDelay: '0s' }} />
          <div className="absolute inset-0 h-12 w-12 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-32 right-16 animate-float">
        <div className="relative">
          <Database className="h-10 w-10 text-green-500/30 floating" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 h-10 w-10 bg-green-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-48 left-1/4 animate-float">
        <div className="relative">
          <Shield className="h-8 w-8 text-purple-500/30 floating" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 h-8 w-8 bg-purple-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-32 right-20 animate-float">
        <div className="relative">
          <Zap className="h-14 w-14 text-yellow-500/30 floating" style={{ animationDelay: '3s' }} />
          <div className="absolute inset-0 h-14 w-14 bg-yellow-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-48 left-12 animate-float">
        <div className="relative">
          <Coins className="h-9 w-9 text-cyan-500/30 floating" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 h-9 w-9 bg-cyan-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-64 right-1/3 animate-float">
        <div className="relative">
          <Globe className="h-11 w-11 text-indigo-500/30 floating" style={{ animationDelay: '5s' }} />
          <div className="absolute inset-0 h-11 w-11 bg-indigo-500 rounded-full opacity-10 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-500/20 rounded-full animate-blockchain-pulse"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${15 + Math.floor(i / 4) * 20}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        >
          <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
        </div>
      ))}

      {/* Connecting Lines Animation */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-network-flow"
            style={{
              top: `${20 + i * 15}%`,
              left: '0%',
              right: '0%',
              animationDelay: `${i * 0.7}s`,
              animationDuration: '6s',
            }}
          />
        ))}
      </div>

      {/* Orbital Elements */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-96 h-96">
          <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-rotate-slow"></div>
          <div className="absolute inset-4 border border-green-500/10 rounded-full animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
          <div className="absolute inset-8 border border-purple-500/10 rounded-full animate-rotate-slow" style={{ animationDuration: '40s' }}></div>
        </div>
      </div>
    </div>
  );
};
