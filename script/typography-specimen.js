import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class TypographySpecimen {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('TypographySpecimen: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      letter: options.letter || 'S',
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.colors = ['#FF0000', '#0000FF', '#FFFF00', '#000000'];
    this.currentColorIndex = 0;
    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollAnimation();
    this.setupEventListeners();
  }

  createElements() {
    const { size, letter } = this.options;
    
    this.container.style.width = `${size}px`;
    this.container.style.height = `${size * 1.25}px`;
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.style.display = 'flex';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.container.style.overflow = 'hidden';
    this.container.classList.add('typography-specimen-container');

    // Letter element
    this.letterEl = document.createElement('div');
    this.letterEl.className = 'typography-letter';
    this.letterEl.textContent = letter;
    this.letterEl.style.fontSize = `${size * 0.8}px`;
    this.letterEl.style.fontWeight = '900';
    this.letterEl.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    this.letterEl.style.color = '#000000';
    this.letterEl.style.lineHeight = '1';
    this.letterEl.style.transition = 'color 0.3s ease';
    this.letterEl.style.userSelect = 'none';

    // Background accent
    this.accent = document.createElement('div');
    this.accent.className = 'typography-accent';
    this.accent.style.position = 'absolute';
    this.accent.style.width = '40%';
    this.accent.style.height = '40%';
    this.accent.style.backgroundColor = '#FFFF00';
    this.accent.style.top = '10%';
    this.accent.style.right = '10%';
    this.accent.style.zIndex = '-1';
    this.accent.style.opacity = '0';

    this.container.appendChild(this.accent);
    this.container.appendChild(this.letterEl);
  }

  setupEventListeners() {
    this.container.addEventListener('click', () => {
      this.cycleColor();
    });

    this.container.addEventListener('mouseenter', () => {
      gsap.to(this.accent, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(this.letterEl, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    this.container.addEventListener('mouseleave', () => {
      gsap.to(this.accent, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      gsap.to(this.letterEl, {
        scale: 1,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  }

  cycleColor() {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
    this.letterEl.style.color = this.colors[this.currentColorIndex];
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    gsap.set(this.letterEl, {
      scale: 0,
      rotation: -45,
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

    tl.to(this.accent, {
      scale: 1,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.out"
    })
    .to(this.letterEl, {
      scale: 1,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: "back.out(1.4)"
    }, "-=0.2");
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export const createTypographySpecimen = (container, options) => {
  return new TypographySpecimen(container, options);
};

export default TypographySpecimen;

