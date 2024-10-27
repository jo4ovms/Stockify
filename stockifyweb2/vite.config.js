import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/namespace
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
