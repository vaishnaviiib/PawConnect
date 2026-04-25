import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Match Express `PORT` from `.env` so the dev proxy reaches the API (default 5000).
dotenv.config({ quiet: true });
const apiPort = process.env.PORT || 5000;
const target = `http://127.0.0.1:${apiPort}`;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": { target, changeOrigin: true },
      "/dogs": { target, changeOrigin: true },
      "/applications": { target, changeOrigin: true },
    },
  },
});
