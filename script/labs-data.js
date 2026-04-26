/**
 * Labs Projects Data
 * Creative experiments, digital art, video work, 3D, and creative coding
 */

export const labsProjects = [
  {
    id: "baroque-museum",
    title: "Baroque Museum",
    category: "code",
    gridSize: "2x2",
    mediaType: "video",
    media: "/gallery-images/baroquepiecesvideo.mp4",
    description: "A digital mini-museum exploring Baroque art masterpieces through an interactive carousel experience.",
    tools: ["Vite", "GSAP", "Lenis"],
    year: "2024",
    externalLink: "https://baroque-museum.vercel.app",
    codeLink: "https://github.com/srikarsunchu/baroque-museum",
    caseStudy: {
      hero: { type: "video", src: "/gallery-images/baroquepiecesvideo.mp4" },
      meta: [
        { label: "Year", value: "2024" },
        { label: "Role", value: "Developer & Designer" },
        { label: "Stack", value: "Vite, GSAP, Lenis" },
      ],
      stack: ["Vite", "GSAP", "Lenis Smooth Scroll", "Vanilla JavaScript"],
      background:
        "A digital gallery for nine Baroque paintings by Caravaggio, Vermeer, and Rembrandt. Built as a horizontal carousel with a short historical note for each work.",
      snapshot: "/gallery-images/baroque-pieces.png",
    },
  },

  {
    id: "helmet-shader",
    title: "Helmet Shader",
    category: "code",
    gridSize: "2x2",
    mediaType: "video",
    media: "/gallery-images/HelmetShaderV2.mp4",
    description: "An interactive 3D dithering shader with real-time adjustable effects via WebGL and custom GLSL shaders.",
    tools: ["WebGL", "Three.js", "GLSL"],
    year: "2024",
    externalLink: "https://helmet-shader.vercel.app/",
    codeLink: "https://github.com/srikarsunchu/helmet-shader",
    caseStudy: {
      hero: { type: "video", src: "/gallery-images/HelmetShaderV2.mp4" },
      meta: [
        { label: "Year", value: "2024" },
        { label: "Role", value: "Developer & Designer" },
        { label: "Stack", value: "React, Three.js, GLSL" },
      ],
      stack: ["React", "Three.js", "React Three Fiber", "GLSL Shaders", "WebGL"],
      background:
        "A racing helmet rendered in React Three Fiber with a custom dithering shader. Pixelation, halftone, grayscale, and bloom are all live controls.",
    },
  },

  {
    id: "ascii-wordmark",
    title: "ASCII Wordmark",
    category: "code",
    gridSize: "2x2",

    mediaType: "component",
    component: "AsciiWordmark",
    modalAspectRatio: "1000 / 290",

    description: "Interactive ASCII particle wordmark. Letterforms are sampled from an SVG into a grid, shimmer through monospace glyphs, and scatter on hover with spring physics.",
    tools: ["Canvas2D", "SVG Sampling", "Spring Physics"],
    year: "2026",

    externalLink: null,
    codeLink: null,
    caseStudy: {
      hero: {
        type: "component",
        component: "AsciiWordmark",
        aspectRatio: "1000 / 290",
      },
      meta: [
        { label: "Year", value: "2026" },
        { label: "Role", value: "Developer & Designer" },
        { label: "Stack", value: "Canvas2D, SVG Sampling" },
      ],
      stack: ["Canvas2D", "SVG Sampling", "Spring Physics", "React"],
      background:
        "An ASCII version of my wordmark. The letterforms are sampled from an SVG into a grid of monospace characters that shimmer and scatter from the cursor.",
    },
  },

  {
    id: "dithering-globe",
    title: "Dithering Globe",
    category: "code",
    gridSize: "2x2",

    mediaType: "component",
    component: "DitheringSphere",

    description: "A 3D sphere rendered with a GLSL dithering shader. No textures — just geometry, light, and ordered noise.",
    tools: ["React", "WebGL", "GLSL"],
    year: "2025",
    caseStudy: {
      hero: { type: "component", component: "DitheringSphere" },
      meta: [
        { label: "Year", value: "2025" },
        { label: "Role", value: "Developer" },
        { label: "Stack", value: "React, WebGL, GLSL" },
      ],
      stack: ["React", "WebGL", "GLSL Fragment Shader", "Ordered Dithering"],
      background:
        "A 3D sphere shaded with a GLSL fragment shader. No textures or post-processing — just geometry, one light, and ordered noise.",
    },
  },

  {
    id: "school-of-athens",
    title: "The School of Athens",
    category: "art",
    gridSize: "2x2",

    mediaType: "component",
    component: "ImageDitheringPink",

    description: "Raphael's School of Athens run through a real-time dithering filter. WebGL pixel shader, no post-processing.",
    tools: ["Paper.design"],
    year: "2025",
    caseStudy: {
      hero: { type: "component", component: "ImageDitheringPink" },
      meta: [
        { label: "Year", value: "2025" },
        { label: "Role", value: "Developer" },
        { label: "Stack", value: "Paper.design, WebGL" },
      ],
      stack: ["Paper.design", "WebGL Pixel Shader", "Ordered Dithering"],
      background:
        "Raphael's School of Athens run through a real-time dithering shader. One pixel-shader pass, no precomputed frames.",
    },
  },

  {
    id: "bodhisattva",
    title: "Bodhisattva",
    category: "art",
    gridSize: "2x2",

    mediaType: "component",
    component: "ImageDitheringGreen",

    description: "A Gandharan Bodhisattva sculpture processed through a real-time dithering shader. Same as School of Athens, different source image.",
    tools: ["Paper.design"],
    year: "2025",
    caseStudy: {
      hero: { type: "component", component: "ImageDitheringGreen" },
      meta: [
        { label: "Year", value: "2025" },
        { label: "Role", value: "Developer" },
        { label: "Stack", value: "Paper.design, WebGL" },
      ],
      stack: ["Paper.design", "WebGL Pixel Shader", "Ordered Dithering"],
      background:
        "A Gandharan Bodhisattva sculpture processed with a real-time dithering shader. The stone texture becomes a reduced field of green pixels and ordered tones.",
    },
  },
];

// Category definitions with color coding
export const categories = {
  all: { 
    label: "All Projects", 
    color: "var(--base-300)",
    count: () => labsProjects.length
  },
  art: { 
    label: "Digital Art", 
    color: "var(--accent-2)", // Pink
    count: () => labsProjects.filter(p => p.category === "art").length
  },
  video: { 
    label: "Video & Film", 
    color: "var(--accent-3)", // Yellow
    count: () => labsProjects.filter(p => p.category === "video").length
  },
  "3d": { 
    label: "3D Work", 
    color: "var(--accent-1)", // Blue
    count: () => labsProjects.filter(p => p.category === "3d").length
  },
  code: { 
    label: "Creative Code", 
    color: "var(--base-300)",
    count: () => labsProjects.filter(p => p.category === "code").length
  },
};

// Get featured project
export function getFeaturedProject() {
  return labsProjects.find(p => p.featured);
}

// Get projects by category
export function getProjectsByCategory(category) {
  if (category === "all") return labsProjects;
  return labsProjects.filter(p => p.category === category);
}

// Get total project count
export function getTotalProjects() {
  return labsProjects.length;
}

