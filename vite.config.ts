import { defineConfig } from "vite";
import path from "path";


export default defineConfig({

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa as bibliotecas pesadas do código do seu app
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
          socket: ['socket.io-client'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumenta o limite para parar o aviso, mas o ideal é dividir
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 Adiciona esta linha
    },
  },


  server: {
    proxy: {
      '/api': {
        target: 'https://liberalconnect.org',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Use se o backend não tiver /api no início
      },
      // Proxy para o Socket.io não falhar
      '/socket.io': {
        target: 'wss://liberalconnect.org',
        ws: true,
      },
    },
  },

});
