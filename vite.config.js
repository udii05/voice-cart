import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  envDir: '.',
  envPrefix: ['VITE_', 'FIREBASE_', 'REACT_APP_', 'NEXT_PUBLIC_'],
  build: { outDir: 'dist' }
});

