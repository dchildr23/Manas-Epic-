import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/manas-steppe/',
  server: {
    allowedHosts: ['kale-uncured-divina.ngrok-free.dev'],
  },
});
