import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aisaacnsoto.dev',
  appName: 'Aprendiendo lenguaje de señas',
  webDir: 'dist/signdetector',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true
    }
  }
};

export default config;
