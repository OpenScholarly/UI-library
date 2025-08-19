import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular()
  ],
  resolve: {
    preserveSymlinks: true
  },
  build: {
    target: 'es2020'
  }
});
