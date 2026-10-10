import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

// Chemin de base : GitHub Pages sert le site sous /Secdeg/.
// Pour un autre hébergeur (Cloudflare Pages), définir VITE_BASE=/ avant le build.
const base = process.env.VITE_BASE ?? '/Secdeg/';

export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Le livre de la restauration',
        short_name: 'Al-jabr',
        description: "Les équations du second degré, à Bagdad en 820, aux côtés d'al-Khwârizmî",
        lang: 'fr',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#f2e9d6',
        theme_color: '#1f4c8f',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Les polices KaTeX font grimper la taille ; on autorise jusqu'à 4 Mo par fichier.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: {
    target: 'es2019', // vieux Chromebooks
  },
});
