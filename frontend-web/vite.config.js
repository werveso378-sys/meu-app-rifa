import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Rifa Baby',
        short_name: 'Rifa',
        description: 'Chá Rifa Baby App',
        theme_color: '#F8F5EC',
        icons: [
          {
            src: 'offline_bear.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'offline_bear.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
