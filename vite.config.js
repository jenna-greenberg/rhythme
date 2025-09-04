/**
 * Vite Configuration
 * 
 * Configuration for Vite build tool used to bundle and serve the React application.
 * Optimized for development experience and production builds.
 * 
 * Features:
 * - Fast HMR (Hot Module Replacement) for development
 * - Optimized production builds with code splitting
 * - Source maps for debugging
 * - Asset optimization and minification
 * - PWA support (if enabled)
 */


// imports
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';


export default defineConfig({
  // Enable React plugin for JSX support and fast refresh
  plugins: [
    react({
      // Enable React Fast Refresh for better development experience
      fastRefresh: true,
      // Include .jsx files in the fast refresh
      include: "**/*.jsx",
    })
  ],

  // Development server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses (useful for network access)
    open: true, // Automatically open browser on server start
    cors: true,
    // Enable hot module replacement
    hmr: {
      overlay: true // Show errors as overlay in browser
    }
  },

  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Minify the output
    minify: 'terser',
    
    // Target modern browsers for smaller bundles
    target: 'es2015',
    
    // Rollup options for more control over bundling
    rollupOptions: {
      // Optimize chunk splitting for better caching
      output: {
        manualChunks: {
          // Separate vendor libraries into their own chunk
          vendor: ['react', 'react-dom'],
          // Separate icon library
          icons: ['lucide-react']
        },
        // Clean asset names
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    
    // Asset handling
    assetsDir: 'assets',
    
    // Size warnings threshold (500kb)
    chunkSizeWarningLimit: 500,
    
    // Terser options for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true // Remove debugger statements
      }
    }
  },

  // Path resolution
  resolve: {
    alias: {
      // Create path aliases for cleaner imports
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@constants': resolve(__dirname, './src/constants')
    }
  },

  // CSS configuration
  css: {
    // PostCSS configuration (can be expanded for tailwind, etc.)
    postcss: {},
    
    // CSS modules configuration (if needed)
    modules: {
      localsConvention: 'camelCase'
    },
    
    // CSS preprocessing
    preprocessorOptions: {
      // SCSS/SASS options (if using SCSS)
      scss: {
        additionalData: '' // Global SCSS imports
      }
    }
  },

  // Environment variables
  define: {
    // Define global constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // Optimization
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ],
    
    // Exclude dependencies from pre-bundling (if needed)
    exclude: []
  },

  // Preview server configuration (for production preview)
  preview: {
    port: 3000,
    host: true,
    open: true
  },

  // ESBuild configuration for faster builds
  esbuild: {
    // Remove console logs in production
    pure: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
    // Enable JSX automatic runtime
    jsx: 'automatic'
  },

  // Base URL (useful for deployment to subdirectories)
  base: '/',

  // Public directory for static assets
  publicDir: 'public',

  // Asset size limit (files smaller than this are inlined as base64)
  assetsInlineLimit: 4096, // 4kb

  // Worker configuration (for web workers if needed)
  worker: {
    format: 'es'
  }
});