import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arcTestnet } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arcTestnet],
  ssr: true,
});

