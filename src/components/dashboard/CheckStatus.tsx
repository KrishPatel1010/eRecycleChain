import React from "react";
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search, Hash, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { polygonAmoy } from 'wagmi/chains';

const statusMap = ['Submitted', 'Collected', 'Verified'];

interface EwasteItem {
  id: number;
  user: string;
  itemType: string;
  location: string;
  timestamp: number;
  status: number;
}

export const CheckStatus = () => {
  const [statusId, setStatusId] = useState('');
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const { isConnected } = useAccount();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const publicClient = usePublicClient({ chainId: polygonAmoy.id });

  const { data: itemCount } = useReadContract({
    address: (import.meta as any).env.VITE_TRACKER_ADDRESS,
    abi: EwasteTrackerABI.abi,
    functionName: 'itemCounter',
    chainId: polygonAmoy.id,
  });

  const isIdValid = statusId !== '' && itemCount !== undefined && Number(statusId) > 0 && Number(statusId) <= Number(itemCount) + 1;

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!statusId) {
      toast.error('Please enter a status ID');
      setStatusMessage({ type: 'error', text: 'Please enter a status ID' });
      return;
    }
    if (!isConnected) {
      toast.error('Please connect your wallet');
      setStatusMessage({ type: 'error', text: 'Please connect your wallet' });
      return;
    }
    if (!isIdValid) {
      toast.error("Item doesn't exist");
      setStatusMessage({ type: 'error', text: "Item doesn't exist" });
      return;
    }
    setIsChecking(true);
    try {
      const idToCheck = Number(statusId) - 1;
      const item = await publicClient!.readContract({
        address: (import.meta as any).env.VITE_TRACKER_ADDRESS,
        abi: EwasteTrackerABI.abi,
        functionName: 'getItem',
        args: [idToCheck],
      }) as EwasteItem | undefined;
      setIsChecking(false);
      if (!item || !item.user || item.user === '0x0000000000000000000000000000000000000000') {
        toast.error('Item not found ❌');
        setStatusMessage({ type: 'error', text: 'Item not found' });
        return;
      }
      const status = statusMap[item.status] || 'Unknown';
      if (status === 'Submitted') {
        toast.info("Item is submitted but hasn't been verified yet");
        setStatusMessage({ type: 'error', text: "Item is submitted but hasn't been verified yet" });
        return;
      }
      toast.success(`Status: ${status} 📊`);
      setStatusMessage({ type: 'success', text: `Status: ${status}` });
    } catch (err: any) {
      setIsChecking(false);
      toast.error('Error fetching item status');
      setStatusMessage({ type: 'error', text: 'Error fetching item status' });
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Search className="h-6 w-6 text-purple-500" />
          <span>Check Item Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCheckStatus} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="statusId" className="text-slate-700 dark:text-slate-300">
              Item Status
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="statusId"
                type="number"
                placeholder={`Enter item ID `}
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 placeholder:text-slate-700 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-slate-300"
              />
            </div>
            {statusId !== '' && !isIdValid && (
              <div className="text-xs text-red-600 mt-1">
                Item doesn't exist. Total numbers of items are  {itemCount ? Number(itemCount) + 1 : '?'}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={isChecking || !isIdValid}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {isChecking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Check Status
              </>
            )}
          </Button>
          {statusMessage && (
            <div
              className={`mt-2 flex items-center text-sm ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <XCircle className="h-4 w-4 mr-1" />
              )}
              {statusMessage.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
