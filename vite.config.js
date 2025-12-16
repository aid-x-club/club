import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteSvgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSvgr({
      svgrOptions: {},
    }),
  ],
  assetsInclude: ["**/*.lottie"],
  server: {
    host: true,
    port: 5173,
    fs: {
      strict: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
});
