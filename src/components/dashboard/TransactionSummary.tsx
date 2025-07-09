import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { Coins, CheckCircle, Package, Award, Star, Medal, ShieldCheck, Leaf, Globe } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const REWARD_PER_ITEM = 10; // 10 RECY per verified item

interface TransactionSummaryProps {
  refreshKey?: number;
}

export const TransactionSummary = ({ refreshKey }: TransactionSummaryProps) => {
  const { address, isConnected } = useAccount();
  const [summary, setSummary] = useState({
    submitted: 0,
    verified: 0,
    earned: 0,
    loading: false,
    total: 0,
  });

  const fetchSummary = useCallback(async () => {
    if (!isConnected || !address) return;
    setSummary((s) => ({ ...s, loading: true }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tracker = new ethers.Contract(
        (import.meta as any).env.VITE_TRACKER_ADDRESS,
        EwasteTrackerABI.abi,
        provider
      );
      const itemCounter = await tracker.itemCounter();
      console.log('Fetched itemCounter from contract:', itemCounter);
      const total = Number(itemCounter);
      let submitted = 0;
      let verified = 0;
      for (let i = 1; i <= total; i++) {
        try {
          const item = await tracker.getItem(i);
          const user = item.user || item[0];
          const status = item.status !== undefined ? item.status : item[1];
          const statusNum = typeof status === 'bigint' ? Number(status) : status;
          if (user && user.toLowerCase() === address.toLowerCase()) {
            submitted++;
            if (statusNum === 2) verified++;
          }
        } catch { }
      }
      setSummary({
        submitted,
        verified,
        earned: verified * REWARD_PER_ITEM,
        loading: false,
        total,
      });
    } catch {
      setSummary((s) => ({ ...s, loading: false }));
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, [address, isConnected, refreshKey]);

  useEffect(() => {
    const handler = () => fetchSummary();
    window.addEventListener('ewaste-data-updated', handler);
    return () => window.removeEventListener('ewaste-data-updated', handler);
  }, [fetchSummary]);

  return (
    <Card className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Package className="h-6 w-6 text-blue-500" />
          <span>Transaction Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summary.loading ? (
          <div className="text-center py-6 text-slate-600 dark:text-slate-300">Loading summary...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white">
                <Package className="h-5 w-5 mb-1" />
                <div className="text-lg font-medium">Total Submitted</div>
                <div className="text-2xl font-bold">{summary.total+1}</div>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
                <CheckCircle className="h-5 w-5 mb-1" />
                <div className="text-lg font-medium">Total Verified</div>
                <div className="text-2xl font-bold">{summary.verified}</div>
              </div>
              <div className="flex flex-col items-center bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-white">
                <Coins className="h-5 w-5 mb-1" />
                <div className="text-lg font-medium">Total Rewards Earned</div>
                <div className="text-2xl font-bold">{summary.earned} RECY</div>
              </div>
            </div>
            {/* Badges and Titles Section */}
            <div className="mt-6">
              <div className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Badges & Titles</div>
              <div className="flex flex-wrap gap-4 items-center">
                {summary.submitted + 1 >= 1 && (
                  <div className="flex flex-col items-center">
                    <Star className="h-7 w-7 text-blue-400 mb-1" />
                    <span className="text-xs font-medium">First Submission</span>
                  </div>
                )}
                {summary.submitted + 1 >= 1 && (
                  <div className="flex flex-col items-center">
                    <Leaf className="h-7 w-7 text-green-500 mb-1" />
                    <span className="text-xs font-medium">Green Starter</span>
                  </div>
                )}
                {summary.submitted + 1 >= 5 && (
                  <div className="flex flex-col items-center">
                    <Medal className="h-7 w-7 text-yellow-500 mb-1" />
                    <span className="text-xs font-medium">Eco Collector</span>
                  </div>
                )}
                {summary.submitted + 1 >= 10 && (
                  <div className="flex flex-col items-center">
                    <Globe className="h-7 w-7 text-cyan-500 mb-1" />
                    <span className="text-xs font-medium">Planet Guardian</span>
                  </div>
                )}
                {summary.submitted + 1 < 1 && (
                  <span className="text-slate-500 text-xs">No badges earned yet. Start submitting to earn badges!</span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 