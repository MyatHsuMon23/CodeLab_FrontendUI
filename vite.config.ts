import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    sourcemap: false, // Don't generate source maps
    rollupOptions: {
      output: {
        manualChunks: undefined, // ✅ Avoid over-splitting
        inlineDynamicImports: true, // Inline all dynamic imports into a single bundle
      },
    },
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit if needed
  },
});
