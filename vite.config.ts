import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [commonjs(), react(), basicSsl()],
  base: "./",
  server: {
    port: 8000,
    open: true,
    host: "0.0.0.0",
    https: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
