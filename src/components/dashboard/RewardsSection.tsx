import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Gift, Coins, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import RewardTokenABI from '../../abis/RewardToken.json';
import { getReadableError } from '../../lib/utils';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { TransactionSummary } from '../../components/dashboard/TransactionSummary';
import * as React from "react"

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface RewardsSectionProps {
  refreshKey?: number;
}

export const RewardsSection = ({ refreshKey }: RewardsSectionProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState({
    recyTokens: 0,
    inrValue: 0,
    totalTransactions: 0,
    submitted: 0,
    verified: 0,
    earnedTokens: 0,
    earnedInr: 0,
  });
  const { address, isConnected } = useAccount();

  const REWARD_PER_ITEM = 10;
  const INR_PER_RECY = 2;

  const fetchRewards = useCallback(async () => {
    if (!isConnected || !address) return;
    setIsChecking(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        (import.meta as any).env.VITE_REWARD_TOKEN_ADDRESS,
        RewardTokenABI.abi,
        provider
      );
      const bal = await contract.balanceOf(address);
      const recyTokens = Number(ethers.formatEther(bal));

      let submitted = 0;
      let verified = 0;
      try {
        const tracker = new ethers.Contract(
          (import.meta as any).env.VITE_TRACKER_ADDRESS,
          EwasteTrackerABI.abi,
          provider
        );
        const itemCounter = await tracker.itemCounter();
        const total = Number(itemCounter);
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
      } catch { }
      const earnedTokens = verified * REWARD_PER_ITEM;
      const earnedInr = earnedTokens * INR_PER_RECY;
      setRewards({
        recyTokens,
        inrValue: recyTokens * INR_PER_RECY,
        totalTransactions: 0, // Not tracked on-chain
        submitted,
        verified,
        earnedTokens,
        earnedInr,
      });
      setShowRewards(true);
      toast.success('Rewards loaded successfully! 🎉');
    } catch (err: any) {
      console.error('Rewards check error:', err);
      toast.error('Failed to load rewards: ' + getReadableError(err));
    }
    setIsChecking(false);
  }, [address, isConnected]);

  useEffect(() => {
    if (showRewards) fetchRewards();
    // eslint-disable-next-line
  }, [address, isConnected, refreshKey]);

  useEffect(() => {
    const handler = () => {
      if (showRewards) fetchRewards();
    };
    window.addEventListener('ewaste-data-updated', handler);
    return () => window.removeEventListener('ewaste-data-updated', handler);
  }, [fetchRewards, showRewards]);

  return (
    <Card className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Gift className="h-6 w-6 text-yellow-500" />
          <span>Check Your Rewards</span>
        </CardTitle>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Conversion rate: <span className="font-semibold">1 RECY ≈ ₹{INR_PER_RECY}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={fetchRewards}
          disabled={isChecking}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading Rewards...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-4 w-4" />
              Check Rewards
            </>
          )}
        </Button>
        {showRewards && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="h-5 w-5" />
                <span className="text-sm font-medium">Wallet RECY Balance</span>
              </div>
              <div className="text-2xl font-bold">{rewards.recyTokens.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Wallet INR Value <span className="italic text-xs">(approximate value)</span></span>
              </div>
              <div className="text-2xl font-bold">₹{rewards.inrValue.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="h-5 w-5" />
                <span className="text-sm font-medium">Total Earned RECY</span>
              </div>
              <div className="text-2xl font-bold">{rewards.earnedTokens.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Earned INR <span className="italic text-xs">(approximate value)</span></span>
              </div>
              <div className="text-2xl font-bold">₹{rewards.earnedInr.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="h-5 w-5" />
                <span className="text-sm font-medium">My Submissions</span>
              </div>
              <div className="text-2xl font-bold">{rewards.submitted + 1}</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg p-4 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Verified Items</span>
              </div>
              <div className="text-2xl font-bold">{rewards.verified}</div>
            </div>
          </div>
        )}
        <TransactionSummary refreshKey={refreshKey} />
      </CardContent>
    </Card>
  );
};
