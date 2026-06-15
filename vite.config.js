import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createApiMiddleware } from "./api/lib/dev-middleware.js";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "api-dev",
      configureServer(server) {
        server.middlewares.use(createApiMiddleware());
      },
    },
  ],
});
