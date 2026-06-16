import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Push Chat (@pushprotocol/restapi) expects Node globals (Buffer/process).
    nodePolyfills({
      include: ["buffer", "process", "util", "stream", "events"],
      globals: { Buffer: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3000,
  },
  define: {
    global: "globalThis",
  },
  // XMTP browser SDK runs WASM in a Web Worker with an OPFS-backed SQLite store.
  // esbuild dep-prebundling can't handle the WASM packages and the glue uses
  // top-level await — exclude the SDK from optimizeDeps and target esnext. It's
  // lazily (dynamically) imported from the Messenger page, so it never weighs on
  // the rest of the app.
  optimizeDeps: {
    include: ["buffer"],
    exclude: ["@xmtp/browser-sdk", "@xmtp/wasm-bindings"],
    esbuildOptions: { target: "esnext" },
  },
  worker: { format: "es" },
  build: { target: "esnext" },
});
