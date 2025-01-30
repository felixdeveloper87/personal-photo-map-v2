import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do .env correto
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      // Escolhe a URL do backend dependendo do ambiente
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        mode === 'development' ? env.VITE_BACKEND_URL_LOCAL : env.VITE_BACKEND_URL
      ),
    },
    server: {
      port: env.VITE_PORT || 5173, // Define a porta localmente
      host: true,
      watch: {
        usePolling: true, // Necessário para Docker
      },
    },
  };
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: process.env.VITE_PORT || 8080,
//     host: true,
//     watch: {
//       usePolling: true,
//     },
//   },
// });