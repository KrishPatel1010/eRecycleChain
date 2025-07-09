import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { Award, Leaf, Medal, ShieldCheck, Star, User, Globe } from 'lucide-react';

interface Leader {
  address: string;
  count: number;
}

const DUMMY_LEADERS: (Leader & { badges: string[] })[] = [
  { address: '0x1111...aaaa', count: 25, badges: ['star', 'green', 'eco', 'planet'] },
  { address: '0x2222...bbbb', count: 14, badges: ['star', 'green', 'eco'] },
  { address: '0x3333...cccc', count: 5, badges: ['star', 'green'] },
  { address: '0x4444...dddd', count: 2, badges: ['star'] },
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Leaderboard = () => {
  const { address, isConnected } = useAccount();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [userVerifiedCount, setUserVerifiedCount] = useState(0);
  const [userSubmissions, setUserSubmissions] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isConnected || !address) return;
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tracker = new ethers.Contract(
          (import.meta as any).env.VITE_TRACKER_ADDRESS,
          EwasteTrackerABI.abi,
          provider
        );
        const itemCounter = await tracker.itemCounter();
        const total = Number(itemCounter);
        const userMap: Record<string, { verified: number; submitted: number }> = {};
        for (let i = 1; i <= total; i++) {
          const item = await tracker.getItem(i);
          const user = item.user || item[0];
          const status = item.status !== undefined ? item.status : item[1];
          const statusNum = typeof status === 'bigint' ? Number(status) : status;
          if (!user || user === '0x0000000000000000000000000000000000000000') continue;
          const userKey = user.toLowerCase();
          if (!userMap[userKey]) userMap[userKey] = { verified: 0, submitted: 0 };
          userMap[userKey].submitted++;
          if (statusNum === 2) userMap[userKey].verified++;
        }
        // Build leaderboard array
        const leaderboard: Leader[] = Object.entries(userMap).map(([addr, stats]) => ({
          address: addr,
          count: stats.verified,
        }));
        // Merge dummy and real leaderboard, then sort
        const merged = [...DUMMY_LEADERS, ...leaderboard];
        const sorted = merged.sort((a, b) => b.count - a.count).slice(0, 5);
        setLeaders(sorted);
        // Find current user's stats
        const myStats = userMap[address.toLowerCase()] || { verified: 0, submitted: 0 };
        setUserVerifiedCount(myStats.verified);
        setUserSubmissions(myStats.submitted);
        // Find rank
        const allSorted = merged.sort((a, b) => b.count - a.count);
        const rank = allSorted.findIndex((u) => u.address === address.toLowerCase()) + 1;
        setMyRank(rank > 0 ? rank : null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [address, isConnected]);

  const formatAddress = (addr: string) =>
    addr === address?.toLowerCase() ? 'You' : `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const renderBadges = (badges: string[] | undefined, count: number, submitted: number = 0) => (
    <div className="flex gap-1 items-center">
      {badges?.includes('star') && (
        <Star className="h-4 w-4 text-blue-400" aria-label="First Submission" />
      )}
      {badges?.includes('green') && (
        <Leaf className="h-4 w-4 text-green-500" aria-label="Green Starter" />
      )}
      {badges?.includes('eco') && (
        <Medal className="h-4 w-4 text-yellow-500" aria-label="Eco Collector" />
      )}
      {badges?.includes('planet') && (
        <Globe className="h-4 w-4 text-cyan-500" aria-label="Planet Guardian" />
      )}
      {!badges && submitted >= 1 && (
        <Star className="h-4 w-4 text-blue-400" aria-label="First Submission" />
      )}
      {!badges && submitted >= 1 && (
        <Leaf className="h-4 w-4 text-green-500" aria-label="Green Starter" />
      )}
      {!badges && submitted >= 5 && (
        <Medal className="h-4 w-4 text-yellow-500" aria-label="Eco Collector" />
      )}
      {!badges && submitted >= 10 && (
        <Globe className="h-4 w-4 text-cyan-500" aria-label="Planet Guardian" />
      )}
    </div>
  );

  return (
    <Card className="bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Award className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
          <span>Top Verifiers Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-slate-500 dark:text-slate-300 py-6">Loading leaderboard...</div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50/70 dark:bg-slate-800/80 rounded-lg border border-blue-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">My Rank:</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-300">{myRank ? `#${myRank}` : 'Unranked'}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400">Verified: {userVerifiedCount}</div>
              </div>
            </div>
            <table className="w-full text-sm bg-white/90 dark:bg-slate-900/80 rounded-lg overflow-hidden">
              <thead>
                <tr className="text-slate-700 dark:text-slate-300 border-b border-blue-100 dark:border-slate-700">
                  <th className="py-2 px-2 text-left">Rank</th>
                  <th className="py-2 px-2 text-left">User</th>
                  <th className="py-2 px-2 text-center">Verified</th>
                  <th className="py-2 px-2 text-right">Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, i) => (
                  <tr
                    key={user.address}
                    className={`border-b border-blue-50 dark:border-slate-800 ${user.address === address?.toLowerCase()
                      ? 'bg-yellow-100/60 dark:bg-yellow-900/40 font-semibold'
                      : i % 2 === 0
                        ? 'bg-blue-50/60 dark:bg-slate-800/60'
                        : 'bg-white/80 dark:bg-slate-900/60'
                      }`}
                  >
                    <td className="py-2 px-2 text-slate-800 dark:text-slate-200">#{i + 1}</td>
                    <td className="py-2 px-2 text-slate-800 dark:text-slate-200">{formatAddress(user.address)}</td>
                    <td className="py-2 px-2 text-center text-slate-900 dark:text-slate-100">{user.count}</td>
                    <td className="py-2 px-2 text-right">
                      {user.address === address?.toLowerCase()
                        ? renderBadges(undefined, userVerifiedCount, userSubmissions)
                        : renderBadges((user as any).badges, user.count, user.count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
};
