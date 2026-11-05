
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
      injectRegister: "script",

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp,woff2}"
        ],
        cleanupOutdatedCaches: true
      }
    })
  ],

  server: {
    proxy: {
      "/api/comick-source": {
        target: "https://comick-source-api.notaspider.dev",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(/^\/api\/comick-source/, "/api"),
      },
    },
  },
});
