
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on all network interfaces to work in containerized/sandbox environments
    host: true,
    port: 3000,
    strictPort: true,
    // Enable HMR (Hot Module Replacement)
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      // Allows clean absolute imports from the root directory
      '@': '/',
    },
  },
  build: {
    // Target modern browsers for better performance and smaller bundles
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    // Optimization for Rollup
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  // Ensure that process.env is handled if needed (common in some legacy libs)
  define: {
    'process.env': {},
  },
});
