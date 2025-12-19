
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Načte proměnné prostředí z .env souborů. 
  // Třetí parametr '' zajistí načtení všech proměnných, nejen těch s prefixem VITE_
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      // Důležité pro cloudové servery a Docker (Coolify)
      host: true,
      port: 3000,
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },
    resolve: {
      alias: {
        '@': '/',
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
    },
    // Google GenAI SDK vyžaduje process.env.API_KEY.
    // Tato sekce ho bezpečně nahradí při sestavování aplikace.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || ""),
      'process.env': env
    },
  };
});
