import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

// App-Name und Farben hier anpassen – sie landen im Web-App-Manifest.
const APP_NAME = 'Ronja – Female Power Coaching';
const APP_SHORT_NAME = 'Female Power';
const THEME_COLOR = '#2b1317';
const BACKGROUND_COLOR = '#fbebe7';

export default defineConfig({
  // Lokale Entwicklung: API und Bilder kommen vom Worker (wrangler dev, Port 8787).
  server: { proxy: { '/api': 'http://localhost:8787', '/img': 'http://localhost:8787' } },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png'],
      manifest: {
        name: APP_NAME,
        short_name: APP_SHORT_NAME,
        lang: 'de',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/img\//],
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}']
      }
    })
  ]
});
