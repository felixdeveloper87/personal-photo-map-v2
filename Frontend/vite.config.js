import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carregar as variáveis de ambiente do .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL || 'https://backend-8pox.onrender.com'),
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
