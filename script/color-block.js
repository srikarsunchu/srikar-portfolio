import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class ColorBlock {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('ColorBlock: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
      rotateInterval: options.rotateInterval || 3000,
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.colors = ['#FF0000', '#0000FF', '#FFFF00', '#000000', '#FFFFFF'];
    this.currentColorIndex = 0;
    this.intervalId = null;
    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollAnimation();
    this.setupEventListeners();
    
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
    this.container.style.overflow = 'hidden';
    this.container.classList.add('color-block-container');

    // Main block
    this.block = document.createElement('div');
    this.block.className = 'color-block';
    this.block.style.width = '100%';
    this.block.style.height = '100%';
    this.block.style.backgroundColor = this.colors[0];
    this.block.style.transition = 'background-color 1s ease';
    this.block.style.display = 'flex';
    this.block.style.alignItems = 'center';
    this.block.style.justifyContent = 'center';

    // Small accent square
    this.accent = document.createElement('div');
    this.accent.className = 'color-accent';
    this.accent.style.width = '25%';
    this.accent.style.height = '20%';
    this.accent.style.backgroundColor = '#FFFFFF';
    this.accent.style.transition = 'all 0.5s ease';

    this.block.appendChild(this.accent);
    this.container.appendChild(this.block);
  }

  setupEventListeners() {
    this.container.addEventListener('click', () => {
      this.stopAutoRotate();
      this.nextColor();
      if (this.options.autoRotate) {
        this.startAutoRotate();
      }
    });

    this.container.addEventListener('mouseenter', () => {
      gsap.to(this.accent, {
        scale: 1.2,
        rotation: 45,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    this.container.addEventListener('mouseleave', () => {
      gsap.to(this.accent, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  }

  nextColor() {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    const newColor = this.colors[this.currentColorIndex];
    const accentColor = newColor === '#FFFFFF' ? '#000000' : '#FFFFFF';
    
    this.block.style.backgroundColor = newColor;
    this.accent.style.backgroundColor = accentColor;
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    gsap.set(this.block, {
      scaleY: 0,
      transformOrigin: "bottom center",
      autoAlpha: 0
    });

    gsap.set(this.accent, {
      scale: 0,
      autoAlpha: 0
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: "top 85%",
        end: "bottom 15%",
        once: true,
      }
    });

    tl.to(this.block, {
      scaleY: 1,
      autoAlpha: 1,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(this.accent, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.3,
      ease: "back.out(1.5)"
    }, "-=0.15");
  }

  startAutoRotate() {
    this.intervalId = setInterval(() => {
      this.nextColor();
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

export const createColorBlock = (container, options) => {
  return new ColorBlock(container, options);
};

export default ColorBlock;

