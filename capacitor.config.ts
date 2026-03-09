import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.game4096.squaregame',
  appName: '4096 Square Game',
  webDir: 'www',
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: false,
    backgroundColor: '#faf8ef',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#faf8ef',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#faf8ef',
    },
  },
  server: {
    iosScheme: 'capacitor',
  },
};

export default config;
