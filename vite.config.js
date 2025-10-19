import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        work: resolve(__dirname, "work.html"),
        project: resolve(__dirname, "project.html"),
        contact: resolve(__dirname, "contact.html"),
        "9m-holdings": resolve(__dirname, "9m-holdings.html"),
        "nerv-studios": resolve(__dirname, "nerv-studios.html"),
        "roshan-studios": resolve(__dirname, "roshan-studios.html"),
        "helmet-shader": resolve(__dirname, "helmet-shader.html"),
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
