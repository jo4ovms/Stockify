import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/namespace
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [svgr(), react(), compression({ algorithm: "brotliCompress" })],
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
