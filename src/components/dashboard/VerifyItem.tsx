import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Hash, CheckCircle, XCircle, Loader2, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { polygonAmoy } from 'wagmi/chains';
import { decodeEventLog, Log } from 'viem';
import * as React from "react"

interface VerifyItemProps {
  verifications: number;
  setVerifications: React.Dispatch<React.SetStateAction<number>>;
}

export const VerifyItem = ({ verifications, setVerifications }: VerifyItemProps) => {
  const [itemId, setItemId] = useState('');
  const { isConnected, address } = useAccount();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: polygonAmoy.id });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    if (!itemId) {
      toast.error('Please enter an item ID');
      setStatusMessage({ type: 'error', text: 'Please enter an item ID' });
      setIsVerifying(false);
      return;
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      setStatusMessage({ type: 'error', text: 'Please connect your wallet' });
      setIsVerifying(false);
      return;
    }

    if (!publicClient) throw new Error("Public client is not available");

    try {
      setStatusMessage(null);

      const idToSend = Number(itemId) - 1;
      if (idToSend < 0) {
        toast.error('Invalid item ID');
        setStatusMessage({ type: 'error', text: 'Invalid item ID' });
        setIsVerifying(false);
        return;
      }

      // Fetch the item from the contract to get the itemType
      const item = await publicClient.readContract({
        address: (import.meta as any).env.VITE_TRACKER_ADDRESS as `0x${string}`,
        abi: EwasteTrackerABI.abi,
        functionName: 'getItem',
        args: [idToSend],
      }) as { user: string; status: number; itemType: string } | undefined;
      console.log('VerifyItem fetched item', idToSend, item);
      if (!item || !item.user || item.user === '0x0000000000000000000000000000000000000000') {
        toast.error('Item not available for verification yet. Please wait a moment and try again.');
        setStatusMessage({ type: 'error', text: 'Item not available for verification yet. Please wait a moment and try again.' });
        setIsVerifying(false);
        return;
      }
      if (item.status === 2) { // 2 = Verified
        toast.error('Item is already verified');
        setStatusMessage({ type: 'error', text: 'Item is already verified' });
        setIsVerifying(false);
        return;
      }

      // Fetch the image from localStorage
      const imageBase64 = localStorage.getItem(`ewaste_image_${Number(itemId)}`);
      if (!imageBase64) {
        toast.error('No image found for this item. Cannot verify.');
        setStatusMessage({ type: 'error', text: 'No image found for this item. Cannot verify.' });
        setIsVerifying(false);
        return;
      }

      // AI Verification Step
      const HF_API_KEY = (import.meta as any).env.VITE_HF_API_KEY;
      if (!HF_API_KEY) {
        toast.error('HuggingFace API key is missing. Please add VITE_HF_API_KEY to your .env file.');
        setStatusMessage({ type: 'error', text: 'HuggingFace API key is missing. Please add VITE_HF_API_KEY to your .env file.' });
        setIsVerifying(false);
        return;
      }
      // Remove the data:image/...;base64, prefix if present
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const response = await fetch('https://api-inference.huggingface.co/models/google/vit-base-patch16-224', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`,
        },
        body: JSON.stringify({ inputs: base64Data }),
      });
      if (!response.ok) {
        let errorMsg = 'AI verification failed. Please try again later.';
        try {
          const errJson = await response.json();
          if (errJson.error) errorMsg += ` [${errJson.error}]`;
        } catch { }
        toast.error(errorMsg);
        setStatusMessage({ type: 'error', text: errorMsg });
        setIsVerifying(false);
        return;
      }
      const result = await response.json();
      const predictions = Array.isArray(result) ? result : result[0]?.label ? [result] : [];
      const itemTypeLower = item.itemType.toLowerCase();
      const match = predictions.slice(0, 3).find((pred: any) => {
        const label = pred.label?.toLowerCase() || '';
        return label.includes(itemTypeLower) || itemTypeLower.includes(label);
      });
      if (!match) {
        toast.error('AI could not verify that the image matches the item type. Please check the image.');
        setStatusMessage({ type: 'error', text: 'AI could not verify the image matches the item type.' });
        setIsVerifying(false);
        return;
      }

      // If AI confirms, proceed with blockchain verification
      const txHash = await writeContractAsync({
        address: (import.meta as any).env.VITE_TRACKER_ADDRESS as `0x${string}`,
        abi: EwasteTrackerABI.abi,
        functionName: 'verifyItem',
        args: [idToSend],
        chain: polygonAmoy,
        account: address,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      const event = receipt.logs
        .map(log => {
          try {
            const logWithTopics = log as any;
            if (!logWithTopics.topics) return null;
            return decodeEventLog({
              abi: EwasteTrackerABI.abi,
              data: logWithTopics.data,
              topics: logWithTopics.topics,
            });
          } catch {
            return null;
          }
        })
        .find(e => e && e.eventName === 'ItemVerified');

      const verifiedItemId =
        event && typeof event.args === 'object' && event.args !== null && 'id' in event.args
          ? (event.args as any).id?.toString()
          : undefined;

      toast.success('Item verified successfully! ✅');
      setStatusMessage({
        type: 'success',
        text: verifiedItemId
          ? `Item verified successfully! Item ID: ${Number(verifiedItemId) + 1}`
          : 'Item verified successfully!',
      });
      setItemId('');
      setIsVerifying(false);
      setVerifications(v => v + 1);
      window.dispatchEvent(new Event('ewaste-data-updated'));
    } catch (err: any) {
      console.error('Verification failed', err);
      toast.error(`Verification failed: ${err?.shortMessage || err?.message || 'Unknown error'}`);
      setStatusMessage({ type: 'error', text: 'Verification failed' });
      setIsVerifying(false);
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Bot className="h-6 w-6 text-purple-500" />
          <Shield className="h-6 w-6 text-green-500" />
          <span>Verify Item by ID</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemId" className="text-slate-700 dark:text-slate-300">
              Item ID
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="itemId"
                type="number"
                placeholder="Enter item ID"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 placeholder:text-slate-700 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-slate-300"
              />
            </div>
          </div>

          {isVerifying && (
            <div className="flex items-center gap-2 p-3 mb-2 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200 animate-pulse">
              <Bot className="h-5 w-5 animate-bounce" />
              <span>AI is verifying the image and item type...</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Verifying...
              </>
            ) : (
              'Verify Item'
            )}
          </Button>
          {statusMessage && (
            <div className={`mt-2 flex items-center text-sm ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
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
