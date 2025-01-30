import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carregar variáveis do .env
  const env = loadEnv(mode, process.cwd(), '');

  // Detecta se está no Render ou Local
  const backendUrl = env.VITE_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8092';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    },
    server: {
      port: env.VITE_PORT || 8080, // Usa 8080 como fallback
      host: true,
      watch: {
        usePolling: true, // Necessário para Docker
      },
    },
  };
});
