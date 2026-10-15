import { defineConfig } from 'vite';

export default defineConfig({
  // model-viewer is lazy-loaded only when a visitor opens the 3D rack
  build: { chunkSizeWarningLimit: 1200 },
});
