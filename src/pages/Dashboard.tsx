import { Navigation } from '../components/Navigation';
import { DashboardHero } from '../components/dashboard/DashboardHero';
import { EWasteForm } from '../components/dashboard/EWasteForm';
import { VerifyItem } from '../components/dashboard/VerifyItem';
import { CheckStatus } from '../components/dashboard/CheckStatus';
import { RewardsSection } from '../components/dashboard/RewardsSection';
import { FloatingElements } from '../components/dashboard/FloatingElements';
import { Star, Medal, ShieldCheck, Leaf, Globe } from 'lucide-react';
import { useRef, useState } from 'react';
import React from 'react';

const Dashboard = () => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [verifications, setVerifications] = useState(0);

  // Scroll to badges area if hash is #badges
  React.useEffect(() => {
    if (window.location.hash === '#badges' && badgeRef.current) {
      badgeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark network-pattern relative">
      <FloatingElements />
      <Navigation />
      <div className="pt-16 relative z-10">
        <DashboardHero />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div id="submit">
              <EWasteForm />
            </div>
            <div id="verify">
              <VerifyItem verifications={verifications} setVerifications={setVerifications} />
            </div>
            <div id="status">
              <CheckStatus />
            </div>
            <div id="rewards">
              <RewardsSection refreshKey={verifications} />
            </div>
            <div id="badges" ref={badgeRef}>
              <div className="mt-8 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-900/40 border border-slate-300 dark:border-slate-700 rounded-2xl p-8 animate-fade-in-up shadow-xl">
                <div className="mb-6 text-2xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-slate-100">
                  <Star className="h-8 w-8 text-blue-400" />
                  Badges & Titles
                </div>
                <div className="mb-6 text-center italic text-base md:text-lg text-blue-700 dark:text-blue-300">
                  “Your actions = real impact. Every verified item is a step toward a cleaner planet.”
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Submission Badge */}
                  <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow hover:scale-105 transition-transform">
                    <Star className="h-10 w-10 text-blue-400" />
                    <div>
                      <div className="font-bold text-lg">First Submission</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Submit your first e-waste item to earn this badge and start your eco journey!</div>
                    </div>
                  </div>
                  {/* Green Starter */}
                  <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow hover:scale-105 transition-transform">
                    <Leaf className="h-10 w-10 text-green-400" />
                    <div>
                      <div className="font-bold text-lg">Green Starter</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Earned with your first submission. Welcome to the eco-hero club!</div>
                    </div>
                  </div>
                  {/* Eco Collector */}
                  <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow hover:scale-105 transition-transform">
                    <Medal className="h-10 w-10 text-yellow-500" />
                    <div>
                      <div className="font-bold text-lg">Eco Collector</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Submit 5 items to become an Eco Collector and inspire others!</div>
                    </div>
                  </div>
                  {/* Planet Guardian */}
                  <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 shadow hover:scale-105 transition-transform">
                    <Globe className="h-10 w-10 text-cyan-500" />
                    <div>
                      <div className="font-bold text-lg">Planet Guardian</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Submit 10 items to earn this title and protect the planet!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
