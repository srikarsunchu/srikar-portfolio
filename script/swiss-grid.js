import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

class SwissGrid {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('SwissGrid: Container not found');
      return;
    }

    this.options = {
      size: options.size || 200,
      gridSize: options.gridSize || 4,
      enableScrollAnimation: options.enableScrollAnimation !== undefined ? options.enableScrollAnimation : true,
    };

    this.cells = [];
    this.init();
  }

  init() {
    this.createElements();
    this.setupScrollAnimation();
    this.setupEventListeners();
  }

  createElements() {
    const { size, gridSize } = this.options;
    
    this.container.style.width = `${size}px`;
    this.container.style.height = `${size * 1.25}px`;
    this.container.style.position = 'relative';
    this.container.style.cursor = 'pointer';
    this.container.style.backgroundColor = '#FFFFFF';
    this.container.classList.add('swiss-grid-container');

    // Create grid
    this.gridEl = document.createElement('div');
    this.gridEl.className = 'swiss-grid';
    this.gridEl.style.width = '100%';
    this.gridEl.style.height = '100%';
    this.gridEl.style.display = 'grid';
    this.gridEl.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    this.gridEl.style.gridTemplateRows = `repeat(${gridSize + 1}, 1fr)`;
    this.gridEl.style.gap = '2px';
    this.gridEl.style.padding = '10%';
    this.gridEl.style.backgroundColor = '#000000';

    // Create cells
    for (let i = 0; i < gridSize * (gridSize + 1); i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.style.backgroundColor = '#FFFFFF';
      cell.style.transition = 'background-color 0.3s ease';
      this.cells.push(cell);
      this.gridEl.appendChild(cell);
    }

    this.container.appendChild(this.gridEl);
  }

  setupEventListeners() {
    this.cells.forEach((cell, index) => {
      cell.addEventListener('mouseenter', () => {
        const colors = ['#FF0000', '#0000FF', '#FFFF00'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = randomColor;
      });

      cell.addEventListener('mouseleave', () => {
        setTimeout(() => {
          cell.style.backgroundColor = '#FFFFFF';
        }, 300);
      });
    });

    this.container.addEventListener('click', () => {
      this.randomHighlight();
    });
  }

  randomHighlight() {
    const colors = ['#FF0000', '#0000FF', '#FFFF00', '#000000'];
    const randomCells = [...this.cells].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    randomCells.forEach((cell, i) => {
      setTimeout(() => {
        cell.style.backgroundColor = colors[i % colors.length];
        setTimeout(() => {
          cell.style.backgroundColor = '#FFFFFF';
        }, 500);
      }, i * 100);
    });
  }

  setupScrollAnimation() {
    if (!this.options.enableScrollAnimation) return;

    gsap.set(this.gridEl, {
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

    tl.to(this.gridEl, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out"
    });

    // Animate cells in
    this.cells.forEach((cell, i) => {
      gsap.set(cell, { scale: 0 });
      tl.to(cell, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(1.5)"
      }, `-=${0.2 - (i * 0.008)}`);
    });
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

export const createSwissGrid = (container, options) => {
  return new SwissGrid(container, options);
};

export default SwissGrid;

