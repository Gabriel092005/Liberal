import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  registerType: "autoUpdate",
  devOptions: {
    enabled: false, // permite ver a PWA atualizando também no modo dev
  },
  strategies:'injectManifest',
  srcDir:'src',
  filename:'sw.ts',
  injectManifest:{
     swDest:'dist/sw.js'
  },
  workbox: {
    clientsClaim: true,
    skipWaiting: true, // força o service worker novo a ativar logo
  },
  manifest: {
    name: "Liberal",
    short_name: "L",
    start_url: "/",
    display: "standalone",
    orientation:'portrait',
    theme_color: "#1E40AF",
    background_color: "#ffffff",
    icons: [
             
  {
    src: "public/manifest-icon",
    sizes: "192x192",
    type: "image/png",
    "purpose": "any"
  },
  {
    src: "public/manifest-icon",
    sizes: "192x192",
    type: "image/png",
    purpose: "maskable"
  },
  {
    src: "public/manifest-icon",
    sizes: "512x512",
    type: "image/png",
    purpose: "any"
  },
  {
    src: "public/manifest-icon",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable"
  }
    ],
  },
})

,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 👈 Adiciona esta linha
    },
  },
});
