import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sites/interventions-hub/',
  resolve: {
    alias: {
      src: "/src",
    },
  },
  assetsInclude: ['**/*.svg'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Remove hashes from all image assets
          if (assetInfo.name?.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|bmp|tiff|avif)$/i)) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Force SVGs to be emitted as separate files instead of inlined
    assetsInlineLimit: 0,
  },
})
