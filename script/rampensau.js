import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Color ramp generation utilities
const uniqueRandomHues = (options) => {
  const hues = [];
  let currentHue = options.startHue;
  const baseStep = 360 / options.total;
  
  for (let i = 0; i < options.total; i++) {
    hues.push(currentHue % 360);
    const step = baseStep + (Math.random() - 0.5) * options.minDistance;
    currentHue += Math.max(options.minDistance, step);
  }
  
  return hues;
};

const generateColorRamp = (options) => {
  const { hueList, sRange, sEasing, lRange, lEasing } = options;
  const colors = [];
  
  hueList.forEach((hue, index) => {
    const t = index / (hueList.length - 1);
    const s = sRange[0] + (sRange[1] - sRange[0]) * sEasing(t);
    const l = lRange[0] + (lRange[1] - lRange[0]) * lEasing(t);
    colors.push([hue, s, l]);
  });
  
  return colors;
};

const getCSSColor = (color) => {
  return `oklch(${color[2] * 100}% ${color[1] * 100}% ${color[0]})`;
};

class RampenSau {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('RampenSau: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
      rotateInterval: options.rotateInterval || 4000,
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.colors = [];
    this.intervalId = null;
    this.init();
  }

  init() {
    this.createElements();
    this.generateNewColors();
    this.setupEventListeners();
    this.setupScrollAnimation();
    
    if (this.options.autoRotate) {
      this.startAutoRotate();
    }
  }

  createElements() {
    const { size } = this.options;
    
    this.container.style.width = `${size}px`;
    this.container.style.height = `${size * 1.25}px`;
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.classList.add('rampensau-container');

    // Main rectangle
    this.rect = document.createElement('div');
    this.rect.className = 'rampensau-rect';
    this.rect.style.width = `${size}px`;
    this.rect.style.height = `${size * 1.0}px`;
    this.rect.style.position = 'relative';
    this.rect.style.transition = 'background 100ms linear';

    // Circle overlay
    this.circle = document.createElement('div');
    this.circle.className = 'rampensau-circle';
    this.circle.style.width = `${size * 0.8}px`;
    this.circle.style.height = `${size * 0.8}px`;
    this.circle.style.borderRadius = '50%';
    this.circle.style.position = 'absolute';
    this.circle.style.left = '50%';
    this.circle.style.bottom = '0';
    this.circle.style.transform = 'translateX(-50%)';
    this.circle.style.transition = 'background 100ms linear';

    // Shadow bar
    this.shadow = document.createElement('div');
    this.shadow.className = 'rampensau-shadow';
    this.shadow.style.width = '100%';
    this.shadow.style.height = `${size * 0.15}px`;
    this.shadow.style.position = 'absolute';
    this.shadow.style.left = '0';
    this.shadow.style.top = `${size * 1.0}px`;
    this.shadow.style.zIndex = '-1';
    this.shadow.style.transformOrigin = 'top';
    this.shadow.style.transition = 'background 100ms linear';

    this.rect.appendChild(this.circle);
    this.container.appendChild(this.rect);
    this.container.appendChild(this.shadow);
  }

  generateNewColors() {
    const lRange = 0.1 + Math.random() * 0.9;
    const lRest = 1 - lRange;
    const lMin = lRest * Math.random();
    const lMax = 1 - lMin;

    const startHue = (Date.now() % 360) + Math.random() * 360;
    
    let newColors = generateColorRamp({
      hueList: uniqueRandomHues({
        startHue: startHue % 360,
        total: 5,
        minDistance: 30,
      }),
      sRange: [Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2],
      sEasing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
      lRange: [lMin, lMax],
      lEasing: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
    });

    if (Math.random() < 0.5) {
      newColors.reverse();
    }

    this.colors = newColors;
    this.updateColors();
  }

  updateColors() {
    if (this.colors.length === 0) return;

    this.rect.style.background = `linear-gradient(90deg, ${getCSSColor(this.colors[0])} 0% 50%, ${getCSSColor(this.colors[1])} 50% 100%)`;
    this.circle.style.background = `linear-gradient(90deg, ${getCSSColor(this.colors[2])} 0% 50%, ${getCSSColor(this.colors[3])} 50% 100%)`;
    this.shadow.style.background = `linear-gradient(90deg, ${getCSSColor(this.colors[0])} 0% 20%, ${getCSSColor(this.colors[1])} 20% 40%, ${getCSSColor(this.colors[2])} 40% 60%, ${getCSSColor(this.colors[3])} 60% 80%, ${getCSSColor(this.colors[4])} 80% 100%)`;
  }

  setupEventListeners() {
    this.container.addEventListener('click', () => {
      this.stopAutoRotate();
      this.generateNewColors();
      if (this.options.autoRotate) {
        this.startAutoRotate();
      }
    });

    this.container.addEventListener('mouseenter', () => {
      gsap.to(this.shadow, {
        scaleY: 1,
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(this.circle, {
        scale: 0.65,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    this.container.addEventListener('mouseleave', () => {
      gsap.to(this.shadow, {
        scaleY: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      gsap.to(this.circle, {
        scale: 0.6,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    // Set initial states
    gsap.set(this.rect, { 
      scaleY: 0, 
      transformOrigin: "bottom center",
      autoAlpha: 0 
    });
    gsap.set(this.circle, { 
      scale: 0, 
      rotation: 0,
      autoAlpha: 0 
    });
    gsap.set(this.shadow, { 
      scaleY: 0,
      autoAlpha: 0 
    });

    // Create entrance timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: "top 85%",
        end: "bottom 15%",
        once: true,
      }
    });

    // Staggered entrance animation
    tl.to(this.rect, {
      scaleY: 1,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(this.circle, {
      scale: 0.8,
      rotation: 180,
      autoAlpha: 1,
      duration: 0.5,
      ease: "back.out(1.2)"
    }, "-=0.2")
    .to(this.circle, {
      scale: 0.6,
      rotation: -180,
      duration: 0.4,
      ease: "power2.inOut"
    }, "-=0.1");
  }

  startAutoRotate() {
    this.intervalId = setInterval(() => {
      this.generateNewColors();
    }, this.options.rotateInterval);
  }

  stopAutoRotate() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy() {
    this.stopAutoRotate();
    this.container.innerHTML = '';
  }
}

export const createRampenSau = (container, options) => {
  return new RampenSau(container, options);
};

export default RampenSau;

