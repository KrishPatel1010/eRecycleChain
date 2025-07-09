import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as React from "react"

// Wagmi & RainbowKit setup
import { WagmiProvider } from 'wagmi';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { polygonAmoy } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'EcoWeave',
  projectId: 'YOUR_PROJECT_ID', // Replace with your WalletConnect project ID
  chains: [polygonAmoy],
  ssr: false,
});

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider appInfo={{ appName: 'EcoWeave' }} modalSize="compact">
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
