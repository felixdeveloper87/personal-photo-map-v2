import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente do arquivo .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Usa a URL correta dependendo do ambiente
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        env.VITE_BACKEND_URL || env.VITE_BACKEND_URL_LOCAL
      ),
    },
    server: {
      port: env.VITE_PORT || 8080, // Usa a porta padrão 8080 caso não esteja no .env
      host: true,
      watch: {
        usePolling: true, // Necessário para rodar no Docker
      },
    },
  };
});
