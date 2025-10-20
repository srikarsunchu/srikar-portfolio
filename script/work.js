import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initAnimations } from "./anime";
import slides from "./slides";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();

  const workList = document.getElementById("work-list");

  // Check if media is a video
  function isVideo(url) {
    return url.match(/\.(mp4|webm|ogg)$/i);
  }

  // Extract year from slide data (could add to slides.js later)
  function getProjectYear(index) {
    // You can customize this or add year data to slides.js
    return index < 2 ? "2025" : "2024";
  }

  // Create project item
  function createProjectItem(project, index) {
    const projectItem = document.createElement("article");
    projectItem.className = "project-item";

    const projectLink = document.createElement("a");
    projectLink.href = project.slideUrl;
    projectLink.className = "project-link";

    // Project Header (Index + Title + Year)
    const header = document.createElement("div");
    header.className = "project-header";

    const indexEl = document.createElement("p");
    indexEl.className = "project-index mono";
    indexEl.textContent = `${String(index + 1).padStart(2, "0")}`;

    const title = document.createElement("h2");
    title.className = "project-title";
    title.textContent = project.slideTitle;

    const year = document.createElement("p");
    year.className = "project-year mono";
    year.textContent = getProjectYear(index);

    header.appendChild(indexEl);
    header.appendChild(title);
    header.appendChild(year);

    // Media Wrapper (Image/Video)
    const mediaWrapper = document.createElement("div");
    mediaWrapper.className = "project-media-wrapper";

    const hasVideo = isVideo(project.slideImg);

    if (hasVideo) {
      // Background image (thumbnail - always visible)
      const thumbnailImg = document.createElement("img");
      thumbnailImg.className = "project-bg-image";
      thumbnailImg.src = project.thumbnail || project.slideImg.replace(/\.(mp4|webm|ogg)$/i, ".png");
      thumbnailImg.alt = project.slideTitle;
      thumbnailImg.loading = "lazy";
      mediaWrapper.appendChild(thumbnailImg);

      // Overlay (blur effect)
      const overlay = document.createElement("div");
      overlay.className = "project-overlay";
      mediaWrapper.appendChild(overlay);

      // Video element (clip-path animation)
      const video = document.createElement("video");
      video.className = "project-video";
      video.src = project.slideImg;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      mediaWrapper.appendChild(video);
    } else {
      // Just image (for projects without video)
      const img = document.createElement("img");
      img.className = "project-bg-image";
      img.src = project.thumbnail || project.slideImg;
      img.alt = project.slideTitle;
      img.loading = "lazy";
      mediaWrapper.appendChild(img);
    }

    // Project Meta (Description + Tags)
    const meta = document.createElement("div");
    meta.className = "project-meta";

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.slideDescription;

    const tags = document.createElement("div");
    tags.className = "project-tags";

    project.slideTags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "project-tag mono";
      tagEl.textContent = tag;
      tags.appendChild(tagEl);
    });

    meta.appendChild(description);
    meta.appendChild(tags);

    // Assemble project link
    projectLink.appendChild(header);
    projectLink.appendChild(mediaWrapper);
    projectLink.appendChild(meta);
    projectItem.appendChild(projectLink);

    return projectItem;
  }

  // Render all projects
  function renderProjects() {
    workList.innerHTML = "";
    slides.forEach((project, index) => {
      const item = createProjectItem(project, index);
      workList.appendChild(item);
    });

    // Initialize video hover effects
    initVideoHoverEffects();

    // Initialize scroll animations
    initScrollAnimations();
  }

  // Video hover effects
  function initVideoHoverEffects() {
    const projectLinks = document.querySelectorAll(".project-link");

    projectLinks.forEach((link) => {
      const video = link.querySelector(".project-video");

      if (!video) return;

      let playTimeout;

      link.addEventListener("mouseenter", () => {
        clearTimeout(playTimeout);
        playTimeout = setTimeout(() => {
          video.play().catch((err) => {
            console.log("Video play prevented:", err);
          });
        }, 100);
      });

      link.addEventListener("mouseleave", () => {
        clearTimeout(playTimeout);
        video.pause();
        video.currentTime = 0;
      });
    });
  }

  // Scroll animations
  function initScrollAnimations() {
    const projectItems = document.querySelectorAll(".project-item");

    projectItems.forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  // Initialize
  renderProjects();
});
