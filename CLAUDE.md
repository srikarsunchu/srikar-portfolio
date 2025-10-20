# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a design engineer portfolio website for Srikar Sunchu built with Vite, vanilla JavaScript, GSAP animations, and Lenis smooth scrolling. The site showcases design and development work with sophisticated scroll-driven animations and page transitions.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (default: http://localhost:5173)
npm run dev

# Start development server with network access
npm run host

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Multi-Page Application Structure
The site uses Vite's multi-page setup with HTML entry points defined in `vite.config.js`. Each HTML file is a separate page:
- `index.html` - Homepage with hero, services cards, featured work
- `about.html` - About page
- `work.html` - Portfolio/work listing
- `contact.html` - Contact page
- Project detail pages: `helmet-shader.html`, `nerv-studios.html`, `roshan-studios.html`, `9m-holdings.html`, `srikar-cv.html`, `design-ledger.html`

URL rewrites are configured in `vercel.json` to enable clean URLs (e.g., `/work` instead of `/work.html`).

### JavaScript Module System
Scripts are organized as ES modules in the `/script` directory:

**Core Modules:**
- `lenis-scroll.js` - Initializes Lenis smooth scrolling with responsive settings
- `transition.js` - Handles page transitions with animated logo mask effect
- `menu.js` - Navigation menu interactions
- `footer.js` - Footer functionality including email form
- `anime.js` - Text animation utilities (scramble, reveal, line-reveal)

**Page-Specific:**
- `home.js` - Homepage scroll animations (hero cards, service cards flip, featured work, outro)
- `about.js` - About page specific animations
- `work.js` - Work listing page animations
- `contact.js` - Contact page functionality
- `project.js` - Individual project detail page logic

### Animation System
The site uses GSAP extensively with ScrollTrigger for scroll-based animations:

1. **Text Animations** (`anime.js`):
   - `scramble` - Character scramble effect
   - `reveal` - Word-by-word slide-up reveal
   - `line-reveal` - Line-by-line slide-up reveal
   - Triggered by `data-animate-type`, `data-animate-delay`, and `data-animate-on-scroll` attributes

2. **Scroll Animations** (primarily in `home.js`):
   - Hero cards disperse on scroll
   - Service cards animate in with flip effect (showing back side)
   - Outro section with word reveal and horizontal strip movement
   - Only active on desktop (>1000px width)

3. **Page Transitions** (`transition.js`):
   - SVG mask-based logo reveal on page load
   - Animated overlay on page navigation
   - Prevents transitions on same-page links

### Styling Architecture
- `globals.css` - Base styles, typography, color variables
- `/css` directory - Page-specific stylesheets
- CSS custom properties for theming in `:root`
- Typography: Barlow Condensed (headings), Host Grotesk (body), DM Mono (monospace)

### Smooth Scrolling Configuration
Lenis is configured with different settings for mobile vs desktop:
- Desktop: `lerp: 0.15`, `duration: 0.8`
- Mobile: `lerp: 0.12`, `duration: 0.6`, `smoothTouch: true`
- Integrated with GSAP ticker for performance

## Key Technical Details

**GSAP Plugins Used:**
- ScrollTrigger - Scroll-based animations
- SplitText - Text splitting for animations (licensed plugin)

**Deployment:**
- Hosted on Vercel
- Git LFS is used for large assets (see `vercel.json` buildCommand)
- Build output directory: `dist`

**Form Handling:**
- Contact forms use Formspree (action: `https://formspree.io/f/myzndvlb`)
- Modal-based contact form on homepage
- Footer email subscription form

## Working with Animations

When adding new animations:
1. Add `data-animate-type` attribute with value: `scramble`, `reveal`, or `line-reveal`
2. Optional: Add `data-animate-delay` for timing control
3. Optional: Add `data-animate-on-scroll="true"` to trigger on scroll into view
4. Animations only run on desktop (>1200px) for performance

## Important Notes

- Desktop-first animation approach: Most animations disabled on mobile/tablet
- Scroll restoration is disabled globally for better transition experience
- Page transitions intercept all internal link clicks
- Responsive breakpoints: Mobile (<900px), Tablet (<1200px), Desktop (>1200px)
