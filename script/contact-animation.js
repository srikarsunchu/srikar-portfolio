class ContactGridAnimation {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      console.error('ContactGridAnimation: Container not found');
      return;
    }

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);

    this.gridSize = 8;
    this.cells = [];
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isHovering = false;

    this.colors = {
      primary: '#FF0066',
      secondary: '#00FFFF',
      tertiary: '#FFD700',
      background: '#0A0A0A',
      grid: '#1A1A1A'
    };

    this.init();
  }

  init() {
    this.setupCanvas();
    this.createGrid();
    this.setupEventListeners();
    this.animate();
  }

  setupCanvas() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    
    this.ctx.scale(dpr, dpr);
    
    this.width = rect.width;
    this.height = rect.height;
  }

  createGrid() {
    const cellWidth = this.width / this.gridSize;
    const cellHeight = this.height / this.gridSize;

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.cells.push({
          x: col * cellWidth,
          y: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1,
          intensity: 0,
          targetIntensity: 0,
          hue: Math.random()
        });
      }
    }
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.isHovering = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovering = false;
    });

    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.cells = [];
      this.createGrid();
    });
  }

  animate() {
    this.time += 0.01;

    // Clear canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Update and draw cells
    this.cells.forEach((cell, index) => {
      // Wave-based intensity
      const wave = Math.sin(this.time * cell.speed + cell.phase) * 0.5 + 0.5;
      
      // Mouse proximity effect
      let mouseInfluence = 0;
      if (this.isHovering) {
        const dx = this.mouseX - (cell.x + cell.width / 2);
        const dy = this.mouseY - (cell.y + cell.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        mouseInfluence = Math.max(0, 1 - distance / 200);
      }

      // Flow pattern
      const flowX = Math.sin(cell.x * 0.01 + this.time) * 0.3;
      const flowY = Math.cos(cell.y * 0.01 + this.time) * 0.3;
      const flow = (flowX + flowY + 1) * 0.5;

      // Combine effects
      cell.targetIntensity = wave * 0.4 + mouseInfluence * 0.5 + flow * 0.3;
      cell.intensity += (cell.targetIntensity - cell.intensity) * 0.1;

      // Draw grid lines
      this.ctx.strokeStyle = this.colors.grid;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);

      // Draw cell fill based on intensity
      if (cell.intensity > 0.1) {
        const colorIndex = Math.floor(cell.hue * 3);
        let color;
        
        switch (colorIndex) {
          case 0:
            color = this.colors.primary;
            break;
          case 1:
            color = this.colors.secondary;
            break;
          default:
            color = this.colors.tertiary;
        }

        // Convert hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.intensity * 0.8})`;
        
        // Add padding to cells
        const padding = 4;
        this.ctx.fillRect(
          cell.x + padding,
          cell.y + padding,
          cell.width - padding * 2,
          cell.height - padding * 2
        );

        // Add glow effect for high intensity
        if (cell.intensity > 0.6) {
          this.ctx.shadowBlur = 20;
          this.ctx.shadowColor = color;
          this.ctx.fillRect(
            cell.x + padding,
            cell.y + padding,
            cell.width - padding * 2,
            cell.height - padding * 2
          );
          this.ctx.shadowBlur = 0;
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

export default ContactGridAnimation;

