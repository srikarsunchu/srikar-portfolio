import { defineConfig } from "vite";
import { resolve } from "path";
import { execSync } from "node:child_process";
import react from "@vitejs/plugin-react";

/** Inject real git build metadata (SHA, commit count, last-commit date) into HTML at dev + build time. */
function buildMetaPlugin() {
  function git(args) {
    try {
      return execSync(`git ${args}`, {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();
    } catch {
      return "";
    }
  }

  function readMeta() {
    const sha = git("rev-parse --short=7 HEAD").toUpperCase() || "DEV0000";
    const countRaw = git("rev-list --count HEAD");
    const count = countRaw ? String(countRaw).padStart(4, "0") : "0000";
    const iso = git("log -1 --format=%cI");
    let date = "—";
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) date = `${m[3]}.${m[2]}.${m[1]}`;
    return { sha, count, date };
  }

  return {
    name: "build-meta",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        const meta = readMeta();
        return html
          .replaceAll("__BUILD_SHA__", meta.sha)
          .replaceAll("__BUILD_COUNT__", meta.count)
          .replaceAll("__BUILD_DATE__", meta.date);
      },
    },
  };
}

/** Match Vercel rewrites so /work, /elide-dev, etc. work with `vite` (not only .html URLs). */
function extensionlessHtmlRoutes() {
  const map = new Map([
    ["/about", "/about.html"],
    ["/work", "/work.html"],
    ["/labs", "/labs.html"],
    ["/project", "/project.html"],
    ["/contact", "/contact.html"],
    ["/9m-holdings", "/9m-holdings.html"],
    ["/srikar-cv", "/srikar-cv.html"],
    ["/roshan-studios", "/roshan-studios.html"],
    ["/helmet-shader", "/helmet-shader.html"],
    ["/design-ledger", "/design-ledger.html"],
    ["/pointpal", "/pointpal.html"],
    ["/baroque-museum", "/baroque-museum.html"],
    ["/viral-engine", "/viral-engine.html"],
    ["/elide-dev", "/elide-dev.html"],
  ]);
  return {
    name: "extensionless-html-routes",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url;
        if (!raw) return next();
        const pathOnly = raw.split("?")[0];
        if (pathOnly.includes(".")) return next();
        const dest = map.get(pathOnly);
        if (dest) {
          const qs = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
          req.url = dest + qs;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), extensionlessHtmlRoutes(), buildMetaPlugin()],
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
        "pointpal": resolve(__dirname, "pointpal.html"),
        "baroque-museum": resolve(__dirname, "baroque-museum.html"),
        "viral-engine": resolve(__dirname, "viral-engine.html"),
        "elide-dev": resolve(__dirname, "elide-dev.html"),
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
