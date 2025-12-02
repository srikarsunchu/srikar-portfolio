import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        work: resolve(__dirname, "work.html"),
        labs: resolve(__dirname, "labs.html"),
        project: resolve(__dirname, "project.html"),
        contact: resolve(__dirname, "contact.html"),
        "9m-holdings": resolve(__dirname, "9m-holdings.html"),
        "srikar-cv": resolve(__dirname, "srikar-cv.html"),
        "roshan-studios": resolve(__dirname, "roshan-studios.html"),
        "helmet-shader": resolve(__dirname, "helmet-shader.html"),
        "design-ledger": resolve(__dirname, "design-ledger.html"),
        "pointpal": resolve(__dirname, "pointpal.html"),
        "baroque-museum": resolve(__dirname, "baroque-museum.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
      "**/*.mp4",
    ],
    copyPublicDir: true,
  },
});
