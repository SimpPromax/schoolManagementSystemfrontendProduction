import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Fix GSAP casing issue
      'gsap/Draggable': path.resolve(__dirname, 'node_modules/gsap/Draggable.js'),
      'gsap': path.resolve(__dirname, 'node_modules/gsap')
    }
  },
  optimizeDeps: {
    include: ['gsap', 'gsap/Draggable'],
    esbuildOptions: {
      // Ensure proper handling of GSAP
      mainFields: ['module', 'main'],
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  },
  server: {
    host: true, // or '0.0.0.0' - this allows network access
    port: 5173,
    strictPort: true, // fail if port is in use
    hmr: {
      host: '192.168.100.126', // your PC's network IP
      protocol: 'ws',
      clientPort: 5173
    },
    allowedHosts: [
      '192.168.100.126',
      'localhost',
      '.localhost',
      'all' // temporarily allow all hosts for testing
    ],
    cors: true, // enable CORS for dev server
    watch: {
      usePolling: true, // useful for some network setups
      interval: 1000, // polling interval
    },
    fs: {
      strict: false, // Allow serving files from outside root
      allow: ['..'] // Allow serving files from parent directory
    }
  },
  preview: {
    host: true,
    port: 5173
  },
  build: {
    commonjsOptions: {
      include: [/gsap/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'gsap': ['gsap', 'gsap/Draggable']
        }
      }
    }
  }
})