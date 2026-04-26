import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initAnimations } from "./anime";
import { 
  labsProjects, 
  categories, 
  getProjectsByCategory, 
  getTotalProjects 
} from "./labs-data";
import {
  ImageDitheringPink,
  ImageDitheringGreen,
  DitheringSphere,
  ColorPanels,
  AsciiWordmark
} from '../components/paper-art';

gsap.registerPlugin(ScrollTrigger);

// Component mapping for React components
const COMPONENT_MAP = {
  'ImageDitheringPink': ImageDitheringPink,
  'ImageDitheringGreen': ImageDitheringGreen,
  'DitheringSphere': DitheringSphere,
  'ColorPanels': ColorPanels,
  'AsciiWordmark': AsciiWordmark,
};

// State
let reactRoots = new Map(); // Store React roots for cleanup

document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  renderGrid();
  updateProjectCount();
  initModal();
});

// ========================================
// GRID RENDERING
// ========================================

function renderGrid() {
  const grid = document.getElementById("labs-grid");
  grid.innerHTML = "";

  // Cleanup existing React roots
  reactRoots.forEach((root) => root.unmount());
  reactRoots.clear();

  console.log('Rendering grid with', labsProjects.length, 'projects');

  labsProjects.forEach((project, index) => {
    const card = createProjectCard(project, index);
    grid.appendChild(card);

    // Mount React component if needed
    if (project.mediaType === "component") {
      console.log('Mounting React component:', project.id, project.component);
      mountReactComponent(project);
    }
  });

  // Initialize scroll animations
  initScrollAnimations();
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = `labs-card grid-${project.gridSize}`;
  card.dataset.category = project.category;
  card.dataset.projectId = project.id;
  
  // Set custom grid position if specified
  if (project.gridColumn) {
    card.style.gridColumn = project.gridColumn;
  }
  if (project.gridRow) {
    card.style.gridRow = project.gridRow;
  }
  
  // Index number (Swiss style)
  const indexEl = document.createElement("div");
  indexEl.className = "labs-card-index mono";
  indexEl.textContent = `[${String(index + 1).padStart(2, "0")}]`;
  
  // Category badge
  const categoryEl = document.createElement("div");
  categoryEl.className = `labs-card-category category-${project.category} mono`;
  categoryEl.textContent = categories[project.category].label;
  
  // Media container
  const mediaEl = createMediaElement(project);
  
  // Info overlay
  const infoEl = document.createElement("div");
  infoEl.className = "labs-card-info";
  
  const titleEl = document.createElement("h3");
  titleEl.className = "labs-card-title";
  titleEl.textContent = project.title;
  
  const descEl = document.createElement("p");
  descEl.className = "labs-card-description";
  descEl.textContent = project.description;
  
  const metaEl = document.createElement("div");
  metaEl.className = "labs-card-meta mono";
  
  const toolsEl = document.createElement("span");
  toolsEl.className = "labs-card-tools";
  toolsEl.textContent = project.tools.join(", ");
  
  const yearEl = document.createElement("span");
  yearEl.className = "labs-card-year";
  yearEl.textContent = project.year;
  
  metaEl.appendChild(toolsEl);
  metaEl.appendChild(yearEl);
  
  infoEl.appendChild(titleEl);
  infoEl.appendChild(descEl);
  infoEl.appendChild(metaEl);
  
  // Assemble card
  card.appendChild(indexEl);
  card.appendChild(categoryEl);
  card.appendChild(mediaEl);
  card.appendChild(infoEl);
  
  // Click handler (open modal)
  card.addEventListener("click", () => {
    openModal(project);
  });
  
  return card;
}

function createMediaElement(project) {
  const mediaContainer = document.createElement("div");
  mediaContainer.className = "labs-card-media";
  
  switch (project.mediaType) {
    case "image":
      const img = document.createElement("img");
      img.src = project.media || "/labs/placeholder.jpg";
      img.alt = project.title;
      img.loading = "lazy";
      mediaContainer.appendChild(img);
      break;
      
    case "video":
      const video = document.createElement("video");
      video.src = project.media || "/labs/placeholder.mp4";
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.loading = "lazy";
      mediaContainer.appendChild(video);

      // Play on hover - note: hover events will be attached after card is inserted
      video.addEventListener("mouseenter", () => {
        video.play().catch(err => console.log("Video play prevented:", err));
      });
      video.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
      break;
      
    case "component":
      // React component container
      const componentContainer = document.createElement("div");
      componentContainer.className = "labs-card-component";
      componentContainer.id = `react-mount-${project.id}`;
      mediaContainer.appendChild(componentContainer);
      break;
      
    case "embed":
      // Thumbnail for embeds (video opens in modal)
      const embedImg = document.createElement("img");
      embedImg.src = project.thumbnail || "/labs/placeholder.jpg";
      embedImg.alt = project.title;
      embedImg.loading = "lazy";
      mediaContainer.appendChild(embedImg);
      break;
  }
  
  return mediaContainer;
}

function mountReactComponent(project) {
  const containerId = `react-mount-${project.id}`;
  const container = document.getElementById(containerId);

  console.log('Attempting to mount:', containerId, 'exists?', !!container);

  if (!container) {
    console.error(`Container not found for ${project.id}`);
    return;
  }

  const Component = COMPONENT_MAP[project.component];

  console.log('Component from map:', project.component, 'found?', !!Component);

  if (!Component) {
    console.error(`Component ${project.component} not found in COMPONENT_MAP`);
    console.error('Available components:', Object.keys(COMPONENT_MAP));
    return;
  }

  try {
    console.log('Creating React root for', project.id);
    const root = createRoot(container);
    root.render(React.createElement(Component));
    reactRoots.set(project.id, root);
    console.log('Successfully mounted', project.id);
  } catch (error) {
    console.error(`Error mounting React component for ${project.id}:`, error);
  }
}

// ========================================
// MODAL SYSTEM
// ========================================

function initModal() {
  const modal = document.getElementById("labs-modal");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  
  // Close handlers
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  
  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
}

function openModal(project) {
  const modal = document.getElementById("labs-modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-body");
  const meta = document.getElementById("modal-meta");
  const actions = document.getElementById("modal-actions");
  
  // Set title
  title.textContent = project.title;
  
  // Clear previous content
  body.innerHTML = "";
  meta.innerHTML = "";
  actions.innerHTML = "";

  // If a caseStudy is provided, render a custom mini case study layout in the
  // modal and skip the default media rendering for this project.
  if (project.caseStudy) {
    renderCaseStudy(project, body, meta, actions);
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();
    return;
  }

  switch (project.mediaType) {
    case "image":
      const img = document.createElement("img");
      img.src = project.media;
      img.alt = project.title;
      body.appendChild(img);
      break;
      
    case "video":
      const video = document.createElement("video");
      video.src = project.media;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      body.appendChild(video);
      break;
      
    case "embed":
      if (project.embedUrl) {
        const iframe = document.createElement("iframe");
        iframe.src = project.embedUrl;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        body.appendChild(iframe);
      }
      break;
      
    case "component":
      const componentContainer = document.createElement("div");
      componentContainer.id = `modal-react-mount-${project.id}`;
      componentContainer.style.width = "100%";
      componentContainer.style.borderRadius = "8px";
      componentContainer.style.overflow = "hidden";
      // Per-project sizing: components with a fixed aspect ratio (e.g. wordmark)
      // use it; everything else falls back to min-height for square-ish content
      if (project.modalAspectRatio) {
        componentContainer.style.aspectRatio = project.modalAspectRatio;
        componentContainer.style.height = "auto";
        componentContainer.style.minHeight = "0";
      } else {
        componentContainer.style.minHeight = "500px";
        componentContainer.style.aspectRatio = "auto";
      }
      body.appendChild(componentContainer);

      setTimeout(() => {
        mountModalReactComponent(project);
      }, 100);
      break;
  }
  
  // Description
  const description = document.createElement("p");
  description.textContent = project.description;
  description.style.marginTop = "0";
  description.style.marginBottom = "1rem";
  description.style.lineHeight = "1.6";
  description.style.fontSize = "0.95rem";
  body.appendChild(description);
  
  // Meta info
  meta.innerHTML = `
    <p class="mono">${project.tools.join(" / ")} · ${project.year}</p>
  `;
  
  // Action buttons
  if (project.externalLink) {
    const viewBtn = document.createElement("a");
    viewBtn.href = project.externalLink;
    viewBtn.target = "_blank";
    viewBtn.rel = "noopener noreferrer";
    viewBtn.className = "modal-action-btn";
    viewBtn.textContent = "View Live ↗";
    actions.appendChild(viewBtn);
  }
  
  if (project.codeLink) {
    const codeBtn = document.createElement("a");
    codeBtn.href = project.codeLink;
    codeBtn.target = "_blank";
    codeBtn.rel = "noopener noreferrer";
    codeBtn.className = "modal-action-btn";
    codeBtn.textContent = "View Source ↗";
    actions.appendChild(codeBtn);
  }
  
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (window.__lenis) window.__lenis.stop();
}

function renderCaseStudy(project, body, meta, actions) {
  const cs = project.caseStudy;

  const wrap = document.createElement("div");
  wrap.className = "modal-case-study";

  // Hero media: video, image, or live React component
  if (cs.hero) {
    if (cs.hero.type === "video" && cs.hero.src) {
      const v = document.createElement("video");
      v.src = cs.hero.src;
      v.className = "modal-cs-hero";
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      wrap.appendChild(v);
    } else if (cs.hero.type === "image" && cs.hero.src) {
      const img = document.createElement("img");
      img.src = cs.hero.src;
      img.alt = `${project.title} hero`;
      img.className = "modal-cs-hero";
      wrap.appendChild(img);
    } else if (cs.hero.type === "component" && cs.hero.component) {
      const heroContainer = document.createElement("div");
      heroContainer.className = "modal-cs-hero modal-cs-hero-component";
      heroContainer.id = `modal-react-mount-${project.id}`;
      if (cs.hero.aspectRatio) {
        heroContainer.style.aspectRatio = cs.hero.aspectRatio;
        heroContainer.style.height = "auto";
        heroContainer.style.minHeight = "0";
      } else {
        heroContainer.style.minHeight = cs.hero.minHeight || "500px";
      }
      wrap.appendChild(heroContainer);

      // Defer mount so the container is in the DOM
      const componentName = cs.hero.component;
      setTimeout(() => {
        const Component = COMPONENT_MAP[componentName];
        if (!Component) {
          console.error(`Hero component "${componentName}" not in COMPONENT_MAP`);
          return;
        }
        try {
          const root = createRoot(heroContainer);
          root.render(React.createElement(Component));
          reactRoots.set(`modal-${project.id}`, root);
        } catch (error) {
          console.error(`Error mounting case study hero component:`, error);
        }
      }, 100);
    }
  }

  // Meta strip
  if (Array.isArray(cs.meta) && cs.meta.length > 0) {
    const dl = document.createElement("dl");
    dl.className = "modal-cs-meta mono";
    cs.meta.forEach(({ label, value }) => {
      const cell = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      cell.appendChild(dt);
      cell.appendChild(dd);
      dl.appendChild(cell);
    });
    wrap.appendChild(dl);
  }

  // Two-column body: stack list + background copy
  const hasStack = Array.isArray(cs.stack) && cs.stack.length > 0;
  const hasBackground = typeof cs.background === "string" && cs.background.length > 0;
  if (hasStack || hasBackground) {
    const csBody = document.createElement("div");
    csBody.className = "modal-cs-body";

    if (hasStack) {
      const stackCol = document.createElement("div");
      stackCol.className = "modal-cs-stack";
      const stackLabel = document.createElement("p");
      stackLabel.className = "mono";
      stackLabel.innerHTML = "<span>&#9654;</span> Stack";
      stackCol.appendChild(stackLabel);
      const ul = document.createElement("ul");
      cs.stack.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });
      stackCol.appendChild(ul);
      csBody.appendChild(stackCol);
    }

    if (hasBackground) {
      const copyCol = document.createElement("div");
      copyCol.className = "modal-cs-copy";
      const copyLabel = document.createElement("p");
      copyLabel.className = "mono";
      copyLabel.innerHTML = "<span>&#9654;</span> Background";
      copyCol.appendChild(copyLabel);
      const p = document.createElement("p");
      p.textContent = cs.background;
      copyCol.appendChild(p);
      csBody.appendChild(copyCol);
    }

    wrap.appendChild(csBody);
  }

  // Snapshot image
  if (cs.snapshot) {
    const snap = document.createElement("img");
    snap.src = cs.snapshot;
    snap.alt = `${project.title} snapshot`;
    snap.className = "modal-cs-snapshot";
    snap.loading = "lazy";
    wrap.appendChild(snap);
  }

  body.appendChild(wrap);

  // Footer meta + actions (reuse existing modal-meta / modal-actions)
  meta.innerHTML = `<p class="mono">${project.tools.join(" / ")} · ${project.year}</p>`;

  if (project.externalLink) {
    const viewBtn = document.createElement("a");
    viewBtn.href = project.externalLink;
    viewBtn.target = "_blank";
    viewBtn.rel = "noopener noreferrer";
    viewBtn.className = "modal-action-btn";
    viewBtn.textContent = "View Live ↗";
    actions.appendChild(viewBtn);
  }
  if (project.codeLink) {
    const codeBtn = document.createElement("a");
    codeBtn.href = project.codeLink;
    codeBtn.target = "_blank";
    codeBtn.rel = "noopener noreferrer";
    codeBtn.className = "modal-action-btn";
    codeBtn.textContent = "View Source ↗";
    actions.appendChild(codeBtn);
  }
}

function mountModalReactComponent(project) {
  const containerId = `modal-react-mount-${project.id}`;
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  const Component = COMPONENT_MAP[project.component];
  if (!Component) return;
  
  try {
    const root = createRoot(container);
    root.render(React.createElement(Component));
    reactRoots.set(`modal-${project.id}`, root);
  } catch (error) {
    console.error(`Error mounting modal React component:`, error);
  }
}

function closeModal() {
  const modal = document.getElementById("labs-modal");
  const body = document.getElementById("modal-body");
  
  // Cleanup React components in modal
  reactRoots.forEach((root, key) => {
    if (key.startsWith("modal-")) {
      root.unmount();
      reactRoots.delete(key);
    }
  });
  
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (window.__lenis) window.__lenis.start();

  // Clear body content after transition
  setTimeout(() => {
    body.innerHTML = "";
  }, 300);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
  const cards = document.querySelectorAll(".labs-card");
  
  cards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.05,
      ease: "power2.out",
      onComplete: () => {
        card.classList.add("visible");
      },
    });
  });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function updateProjectCount() {
  const countEl = document.getElementById("project-count");
  const total = getTotalProjects();
  countEl.innerHTML = `<span>&#9654;</span> ${total} Project${total !== 1 ? 's' : ''}`;
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  reactRoots.forEach((root) => root.unmount());
  reactRoots.clear();
});

