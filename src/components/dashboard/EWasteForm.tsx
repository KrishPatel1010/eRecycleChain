import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, MapPin, Send, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount, useWriteContract, usePublicClient, useReadContract } from 'wagmi';
import EwasteTrackerABI from '../../abis/EwasteTracker.json';
import { polygonAmoy } from 'wagmi/chains';
import { decodeEventLog } from 'viem';
import * as React from "react"

export const EWasteForm = () => {
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [aiVerifying, setAiVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { writeContractAsync, isPending } = useWriteContract();
  const publicClient = usePublicClient({ chainId: polygonAmoy.id });
  const { data: itemCount, refetch: refetchItemCount } = useReadContract({
    address: (import.meta as any).env.VITE_TRACKER_ADDRESS,
    abi: EwasteTrackerABI.abi,
    functionName: 'itemCounter',
    chainId: polygonAmoy.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !location) {
      toast.error('Please fill in all fields');
      setStatusMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }
    if (!image) {
      toast.error('Please upload an image');
      setStatusMessage({ type: 'error', text: 'Please upload an image' });
      return;
    }
    if (!isConnected || !address) {
      toast.error('Please connect your wallet');
      setStatusMessage({ type: 'error', text: 'Please connect your wallet' });
      return;
    }
    setStatusMessage(null);
    setSubmitting(true);
    // No AI verification here anymore
    try {
      if (!publicClient) throw new Error("Public client is not available");
      const txHash = await writeContractAsync({
        address: (import.meta as any).env.VITE_TRACKER_ADDRESS as `0x${string}`,
        abi: EwasteTrackerABI.abi,
        functionName: 'submitItem',
        args: [itemName, location],
        chain: polygonAmoy,
        account: address,
      });

      // Wait for the transaction to be mined and get the receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      // Find the ItemSubmitted event in the logs
      const event = receipt.logs
        .map(log => {
          try {
            // Only decode logs with topics (event logs)
            if (!('topics' in log)) return null;
            return decodeEventLog({
              abi: EwasteTrackerABI.abi,
              data: log.data,
              topics: log.topics as [signature: `0x${string}`, ...args: `0x${string}`[]],
            });
          } catch {
            return null;
          }
        })
        .find(e => e && e.eventName === 'ItemSubmitted');

      let newItemId: string | undefined;
      if (event?.args) {
        if (Array.isArray(event.args)) {
          // Usually the first argument is the ID for ItemSubmitted
          newItemId = event.args[0] !== undefined ? (Number(event.args[0]) + 1).toString() : undefined;
        } else if ('id' in event.args) {
          newItemId = (Number((event.args as any).id) + 1).toString();
        }
      }

      // Retry fetching the new item up to 3 times with 1s delay
      let itemFound = false;
      if (newItemId) {
        const idToCheck = Number(newItemId) - 1;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const item = await publicClient.readContract({
              address: (import.meta as any).env.VITE_TRACKER_ADDRESS as `0x${string}`,
              abi: EwasteTrackerABI.abi,
              functionName: 'getItem',
              args: [idToCheck],
            }) as { user: string } | undefined;
            if (item && item.user && item.user !== '0x0000000000000000000000000000000000000000') {
              itemFound = true;
              break;
            }
          } catch { }
          await new Promise(res => setTimeout(res, 1000));
        }
      }

      toast.success('E-Waste submitted successfully!');
      setStatusMessage({
        type: 'success',
        text: newItemId
          ? itemFound
            ? `Item added successfully! Your Item ID is ${newItemId}`
            : `Item added! Your Item ID is ${newItemId}. (It may take a moment to appear in the system.)`
          : 'Item added successfully! (Could not fetch Item ID)'
      });
      setSubmitting(false);
      setItemName('');
      setLocation('');
      await refetchItemCount?.();
      // Notify all listeners to refetch data
      window.dispatchEvent(new Event('ewaste-data-updated'));

      // Store the image in localStorage for demo verification (step 1)
      if (imagePreview && newItemId) {
        try {
          localStorage.setItem(`ewaste_image_${newItemId}`, imagePreview);
        } catch (e) {
          // Ignore storage errors
        }
      }
    } catch (err: any) {
      toast.error('Submission failed');
      setStatusMessage({ type: 'error', text: 'Item not added' });
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-300 dark:border-slate-700 animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <Package className="h-6 w-6 text-blue-500" />
          <span>Submit E-Waste Item</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-slate-700 dark:text-slate-300">
              Item Name
            </Label>
            <Input
              id="itemName"
              type="text"
              placeholder="e.g., iPhone 12, Dell Laptop, Samsung TV"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="bg-white/90 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 placeholder:text-slate-700 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-700 dark:text-slate-300">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                id="location"
                type="text"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 placeholder:text-slate-700 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-slate-300"
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-slate-700 dark:text-slate-300">
              Upload Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-white/90 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 focus:border-black dark:focus:border-slate-300"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="max-h-40 rounded border border-slate-200 dark:border-slate-700" />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting || aiVerifying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {(submitting || aiVerifying) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {aiVerifying ? 'Verifying Image...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit E-Waste
              </>
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
