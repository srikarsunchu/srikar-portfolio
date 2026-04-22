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
    year: "2025",
    externalLink: "/baroque-museum",
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
    externalLink: "/helmet-shader",
  },

  {
    id: "gradient-cards",
    title: "Gradient Cards",
    category: "code",
    gridSize: "2x2",

    mediaType: "component",
    component: "ColorPanels",

    description: "Interactive color panels rendered with WebGL shaders. Each card runs a live gradient field in the browser.",
    tools: ["React", "WebGL"],
    year: "2025",

    externalLink: null,
    codeLink: null,
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

