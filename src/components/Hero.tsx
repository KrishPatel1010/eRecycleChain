import * as React from "react"
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Recycle, Smartphone, Laptop, CircuitBoard, Network, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartMining = () => {
    navigate('/dashboard');
  };

  const floatingItems = [
    { icon: Smartphone, delay: 0, x: 20, y: 30 },
    { icon: Laptop, delay: 2, x: 80, y: 20 },
    { icon: CircuitBoard, delay: 4, x: 70, y: 70 },
    { icon: Recycle, delay: 1, x: 10, y: 80 },
    { icon: Network, delay: 3, x: 90, y: 50 },
    { icon: Database, delay: 5, x: 15, y: 15 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark network-pattern">
      {/* Animated Blockchain Network Background */}
      <div className="absolute inset-0 blockchain-network">
        {/* Network nodes - responsive */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-blockchain-pulse"
            style={{
              left: `${20 + (i % 4) * 20}%`,
              top: `${20 + Math.floor(i / 4) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={`${20 + (i % 3) * 30}%`}
              y1={`${30 + Math.floor(i / 3) * 25}%`}
              x2={`${40 + (i % 3) * 25}%`}
              y2={`${45 + Math.floor(i / 3) * 20}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              className="animate-network-flow"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Elements - hide on mobile */}
      {floatingItems.map((item, index) => (
        <div
          key={index}
          className="absolute floating hidden lg:block"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        >
          <div className="p-3 md:p-4 bg-slate-200/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl md:rounded-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 animate-blockchain-pulse">
            <item.icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-6 animate-fade-in-up border border-blue-500/30">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Smarter E-Waste Recycling with AI-Powered Blockchain Verification</span>
          </div>

          {/* Main Heading - responsive */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-in-up leading-tight text-center" style={{ animationDelay: '0.1s' }}>
            <span>
              Revolutionizing{' '}
              <span className="text-gradient-blockchain relative">
                E-Waste
                <div className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"></div>
              </span>
            </span>
            <br />
            <span className="block mt-4">with AI & Blockchain</span>
          </h1>

          {/* Subtitle - responsive */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.2s' }}>
            Transform electronic waste into digital assets through our blockchain-verified recycling ecosystem.
            Every device recycled creates immutable proof of environmental impact.
          </p>

          {/* CTA Buttons - responsive */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={handleStartMining}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group w-full sm:w-auto"
            >
              Start Your Recycling Journey
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:text-slate-900 border-0 shadow-lg hover:shadow-xl px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto relative overflow-hidden group"
              onClick={() => navigate('/explore')}
            >
              <span className="relative z-10">Explore Network</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Stats - responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-16 animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '2.3M', label: 'Verified Transactions', color: 'text-blue-600 dark:text-blue-400' },
              { value: '₹50Cr', label: 'Token Rewards', color: 'text-cyan-600 dark:text-cyan-400' },
              { value: '156', label: 'Network Nodes', color: 'text-purple-600 dark:text-purple-400' },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-300 dark:border-slate-700">
                <div className={`text-3xl sm:text-4xl md:text-5xl font-bold ${stat.color} mb-2 font-mono`}>
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rotating Blockchain Ring - hide on mobile */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 hidden lg:block">
        <div className="w-96 h-96 border border-blue-500/10 dark:border-blue-500/20 rounded-full rotate-slow">
          <div className="w-80 h-80 border border-cyan-500/10 dark:border-cyan-500/20 rounded-full rotate-slow m-8" style={{ animationDirection: 'reverse' }}></div>
        </div>
      </div>
    </section>
  );
};
