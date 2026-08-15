import { defineConfig } from "astro/config";

const workerOrigin = process.env.WORKER_ORIGIN;

export default defineConfig({
  output: "static",
  vite: workerOrigin
    ? {
        server: {
          proxy: {
            "/api": {
              target: workerOrigin,
              changeOrigin: true,
            },
          },
        },
      }
    : {},
});
