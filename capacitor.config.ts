import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nikshep.nikkitv',
  appName: 'nikkitv',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Point to your Vercel deployment so the app always gets live channels
    url: 'https://nikkitv.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
