import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.association.soireesjeux',
  appName: 'Soirées Jeux',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      // The web SDK stays the single source of truth for the signed-in user.
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
};

export default config;
