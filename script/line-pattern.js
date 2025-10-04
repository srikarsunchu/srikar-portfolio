import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class LinePattern {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('LinePattern: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      lineCount: options.lineCount || 8,
      orientation: options.orientation || 'vertical', // 'vertical' or 'horizontal'
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.lines = [];
    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollAnimation();
    this.setupEventListeners();
  }

  createElements() {
    const { size, lineCount, orientation } = this.options;
    
    this.container.style.width = `${size}px`;
    this.container.style.height = `${size * 1.25}px`;
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.style.backgroundColor = '#FFFFFF';
    this.container.style.overflow = 'hidden';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = orientation === 'vertical' ? 'row' : 'column';
    this.container.style.gap = '4px';
    this.container.style.padding = '10%';
    this.container.classList.add('line-pattern-container');

    // Create lines
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'pattern-line';
      line.style.flex = '1';
      line.style.backgroundColor = '#000000';
      line.style.transition = 'background-color 0.3s ease';
      
      if (orientation === 'vertical') {
        line.style.height = '100%';
      } else {
        line.style.width = '100%';
      }

      this.lines.push(line);
      this.container.appendChild(line);
    }
  }

  setupEventListeners() {
    const colors = ['#FF0000', '#0000FF', '#FFFF00', '#000000'];

    this.lines.forEach((line, index) => {
      line.addEventListener('mouseenter', () => {
        const color = colors[index % colors.length];
        line.style.backgroundColor = color;
      });

      line.addEventListener('mouseleave', () => {
        setTimeout(() => {
          line.style.backgroundColor = '#000000';
        }, 300);
      });
    });

    this.container.addEventListener('click', () => {
      this.randomColorize();
    });
  }

  randomColorize() {
    const colors = ['#FF0000', '#0000FF', '#FFFF00', '#000000'];
    
    this.lines.forEach((line, i) => {
      setTimeout(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        line.style.backgroundColor = randomColor;
        
        setTimeout(() => {
          line.style.backgroundColor = '#000000';
        }, 500);
      }, i * 50);
    });
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    this.lines.forEach((line, i) => {
      if (this.options.orientation === 'vertical') {
        gsap.set(line, {
          scaleY: 0,
          transformOrigin: "bottom center",
          autoAlpha: 0
        });

        gsap.to(line, {
          scaleY: 1,
          autoAlpha: 1,
          duration: 0.4,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: this.container,
            start: "top 85%",
            end: "bottom 15%",
            once: true,
          }
        });
      } else {
        gsap.set(line, {
          scaleX: 0,
          transformOrigin: "left center",
          autoAlpha: 0
        });

        gsap.to(line, {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.4,
          delay: i * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: this.container,
            start: "top 85%",
            end: "bottom 15%",
            once: true,
          }
        });
      }
    });
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export const createLinePattern = (container, options) => {
  return new LinePattern(container, options);
};

export default LinePattern;

