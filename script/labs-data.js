/**
 * Labs Projects Data
 * Creative experiments, digital art, video work, 3D, and creative coding
 */

export const labsProjects = [
  {
    id: "gradient-cards",
    title: "Gradient Cards",
    category: "code",
    gridSize: "2x2",

    mediaType: "component",
    component: "ColorPanels",

    description: "Made in React",
    tools: ["React", "WebGL"],
    year: "2025",

    externalLink: null,
    codeLink: null,
  },

  {
    id: "dithering-globe",
    title: "Dithering Globe",
    category: "code",
    gridSize: "2x2",

    mediaType: "component",
    component: "DitheringSphere",

    description: "Made in React",
    tools: ["React", "WebGL", "GLSL"],
    year: "2025",
  },

  {
    id: "school-of-athens",
    title: "The School of Athens",
    category: "art",
    gridSize: "2x2",

    mediaType: "component",
    component: "ImageDitheringPink",

    description: "Made with Paper.design",
    tools: ["Paper.design", ],
    year: "2025",
  },

  {
    id: "bodhisattva",
    title: "Bodhisattva",
    category: "art",
    gridSize: "2x2",

    mediaType: "component",
    component: "ImageDitheringGreen",

    description: "Made with Paper.design",
    tools: ["Paper.design",],
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

