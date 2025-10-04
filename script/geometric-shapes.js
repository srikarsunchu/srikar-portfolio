import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class GeometricShapes {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('GeometricShapes: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.shapes = [];
    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollAnimation();
    this.setupEventListeners();
  }

  createElements() {
    const { size } = this.options;
    
    this.container.style.width = `${size}px`;
    this.container.style.height = `${size * 1.25}px`;
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.style.backgroundColor = '#FFFFFF';
    this.container.style.overflow = 'hidden';
    this.container.classList.add('geometric-shapes-container');

    // Create shapes
    const shapeConfigs = [
      { type: 'circle', size: 0.6, color: '#FF0000', x: 50, y: 40 },
      { type: 'square', size: 0.4, color: '#0000FF', x: 30, y: 60 },
      { type: 'circle', size: 0.3, color: '#FFFF00', x: 70, y: 70 }
    ];

    shapeConfigs.forEach(config => {
      const shape = document.createElement('div');
      shape.className = `shape shape-${config.type}`;
      shape.style.position = 'absolute';
      shape.style.width = `${size * config.size}px`;
      shape.style.height = `${size * config.size}px`;
      shape.style.backgroundColor = config.color;
      shape.style.left = `${config.x}%`;
      shape.style.top = `${config.y}%`;
      shape.style.transform = 'translate(-50%, -50%)';
      shape.style.mixBlendMode = 'multiply';
      shape.style.transition = 'transform 0.3s ease';
      
      if (config.type === 'circle') {
        shape.style.borderRadius = '50%';
      }

      this.shapes.push(shape);
      this.container.appendChild(shape);
    });
  }

  setupEventListeners() {
    this.container.addEventListener('click', () => {
      this.rearrange();
    });

    this.container.addEventListener('mouseenter', () => {
      this.shapes.forEach((shape, i) => {
        gsap.to(shape, {
          scale: 1.1,
          duration: 0.3,
          delay: i * 0.05,
          ease: "power2.out"
        });
      });
    });

    this.container.addEventListener('mouseleave', () => {
      this.shapes.forEach((shape, i) => {
        gsap.to(shape, {
          scale: 1,
          duration: 0.3,
          delay: i * 0.05,
          ease: "power2.in"
        });
      });
    });
  }

  rearrange() {
    this.shapes.forEach(shape => {
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 60;
      const rotation = Math.random() * 360;
      
      gsap.to(shape, {
        left: `${x}%`,
        top: `${y}%`,
        rotation: rotation,
        duration: 0.6,
        ease: "power2.inOut"
      });
    });
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    this.shapes.forEach((shape, i) => {
      gsap.set(shape, {
        scale: 0,
        rotation: -180,
        autoAlpha: 0
      });

      gsap.to(shape, {
        scale: 1,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.5,
        delay: i * 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: this.container,
          start: "top 85%",
          end: "bottom 15%",
          once: true,
        }
      });
    });
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export const createGeometricShapes = (container, options) => {
  return new GeometricShapes(container, options);
};

export default GeometricShapes;

