import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // atualiza automaticamente quando houver nova versão
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Minha Aplicação React",
        short_name: "MeuApp",
        description: "Uma aplicação React convertida em PWA 🚀",
        theme_color: "#1E40AF", // azul, podes alterar
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 Adiciona esta linha
    },
  },
});
