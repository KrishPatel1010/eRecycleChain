import * as React from "react"
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Recycle, Menu, X, Shield, Globe, Cpu, Network, Sun, Moon, Home, BarChart3, Award, Search, Star, Medal, ShieldCheck, Leaf } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLocation, useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Leaderboard } from './dashboard/Leaderboard';

const exploreNavItems = [
  { name: 'Verifier Overview', href: '#what-is-verifier' },
  { name: 'Network', href: '#blockchain-verification' },
  { name: 'Sample Verifier Profiles', href: '#verifier-profiles' },
  { name: 'Conclusion', href: '#verifier-conclusion' },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  const isExplore = location.pathname === '/explore';

  const homeNavItems = [
    { name: 'How It Works', href: '#how-it-works', icon: Cpu },
    { name: 'Blockchain', href: '#blockchain', icon: Shield },
    { name: 'Impact', href: '#impact', icon: Globe },
    { name: 'Network', href: '#network', icon: Network },
    { name: 'Explore Network', href: '/explore', icon: Award },
  ];

  const dashboardNavItems = [
    { name: 'Leaderboard', href: '#leaderboard', icon: Award },
    { name: 'Submit E-Waste', href: '#submit', icon: Recycle },
    { name: 'My Rewards', href: '#rewards', icon: Award },
    { name: 'Badges', href: '#badges', icon: Star },
  ];

  const navItems = isDashboard ? dashboardNavItems : homeNavItems;

  // For Explore page: track active section
  const [activeSection, setActiveSection] = useState<string>('');
  useEffect(() => {
    if (!isExplore) return;
    const handleScroll = () => {
      let found = '';
      for (const item of exploreNavItems) {
        const el = document.querySelector(item.href);
        if (el) {
          const rect = (el as HTMLElement).getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) {
            found = item.href;
            break;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExplore]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setActiveSection(href);
      }
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // If already on home page, scroll to top and refresh
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Use a more reliable refresh method
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else {
      // Navigate to home page
      navigate('/');
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-700 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleHomeClick}>
            <div className="relative">
              <Recycle className="h-8 w-8 text-blue-500 animate-pulse-glow" />
              <div className="absolute inset-0 h-8 w-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <span className="text-xl font-heading font-bold text-gradient-blockchain">
              eRecycleChain
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 transform cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </button>
            {isExplore ? (
              exploreNavItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 transform cursor-pointer${activeSection === item.href ? ' text-blue-500 font-bold' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="font-medium">{item.name}</span>
                </button>
              ))
            ) : (
              navItems.map((item, index) => (
                item.name === 'Leaderboard' ? (
                  <Popover key={item.name}>
                    <PopoverTrigger asChild>
                      <button
                        className="flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 transform cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px] max-w-[90vw]">
                      <Leaderboard />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition-all duration-300 hover:scale-105 transform cursor-pointer${location.pathname === '/explore' && item.href === '/explore' ? ' text-blue-500 font-bold' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                )
              ))
            )}
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-slate-300 hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in-up">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-all duration-200 w-full text-left"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
            {isExplore ? (
              exploreNavItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-all duration-200 w-full text-left${activeSection === item.href ? ' text-blue-500 font-bold' : ''}`}
                >
                  <span>{item.name}</span>
                </button>
              ))
            ) : (
              navItems.map((item, index) => (
                item.name === 'Leaderboard' ? (
                  <Popover key={item.name}>
                    <PopoverTrigger asChild>
                      <button
                        className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-all duration-200 w-full text-left"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[400px] max-w-[95vw]">
                      <Leaderboard />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-all duration-200 w-full text-left${location.pathname === '/explore' && item.href === '/explore' ? ' text-blue-500 font-bold' : ''}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                )
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
