import { useEffect, useRef } from "react";

const ASCII_CHARS = ".:+*#%@0369";
const CHAR_COLOR = "#f9f4eb";
const BG_COLOR = "#0a0a0a";
const THRESHOLD = 0.15;
const PUSH_RADIUS = 7;
const PUSH_FORCE = 24;
const SPRING = 0.03;
const DAMPING = 0.5;
const SHIMMER_MS = 100;

// Inline SVG source serialized once. The visible canvas samples this for cell positions.
const SOURCE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 290" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="#000"/><text x="0" y="250" text-anchor="start" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="500" font-size="290" letter-spacing="2" fill="#fff">srikar</text><text x="820" y="250" text-anchor="start" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="500" font-size="220" fill="#fff">©</text></svg>`;

export default function AsciiWordmark() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = window.devicePixelRatio || 1;

    let CELL_SIZE, CELL_GAP, CELL_STEP;
    let cols = 0;
    let rows = 0;
    let cells = [];
    let mouse = { col: -999, row: -999, isMoving: false };
    let idleTimer = null;
    let animFrameId = null;
    let shimmerTimer = null;
    let resizeTimer = null;
    let resizeObserver = null;
    let isAnimating = false;
    let disposed = false;

    function getCellSize() {
      const w = canvas.offsetWidth;
      if (w < 240) return 2;
      if (w < 480) return 3;
      if (w < 768) return 4;
      return 5;
    }

    function setupCanvas() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) return false;
      CELL_SIZE = getCellSize();
      CELL_GAP = CELL_SIZE <= 3 ? 1 : 2;
      CELL_STEP = CELL_SIZE + CELL_GAP;
      cols = Math.floor(w / CELL_STEP);
      rows = Math.floor(h / CELL_STEP);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return cols > 0 && rows > 0;
    }

    function buildCells(data) {
      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = (row * cols + col) * 4;
          const brightness =
            (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
          const isLit = brightness > THRESHOLD;
          const char = isLit
            ? ASCII_CHARS[Math.min(ASCII_CHARS.length - 1, Math.floor(brightness * ASCII_CHARS.length))]
            : " ";
          cells.push({ col, row, char, isLit, offsetX: 0, offsetY: 0, velX: 0, velY: 0 });
        }
      }
    }

    function sampleSourceSVG(onComplete) {
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(SOURCE_SVG);
      const img = new Image();
      img.onload = () => {
        if (disposed) return;
        const sc = document.createElement("canvas");
        sc.width = cols;
        sc.height = rows;
        const sCtx = sc.getContext("2d");
        sCtx.fillStyle = "#000";
        sCtx.fillRect(0, 0, cols, rows);
        sCtx.drawImage(img, 0, 0, cols, rows);
        const { data } = sCtx.getImageData(0, 0, cols, rows);
        buildCells(data);
        onComplete();
      };
      img.onerror = onComplete;
      img.src = url;
    }

    function renderFrame() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CELL_SIZE + 2}px monospace`;
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.fillStyle = CHAR_COLOR;

      for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
        if (!isLit) continue;
        const x = (col + Math.round(offsetX)) * CELL_STEP;
        const y = (row + Math.round(offsetY)) * CELL_STEP;
        ctx.fillText(char, x + CELL_SIZE / 2, y);
      }
    }

    function updatePhysics() {
      let anyActive = false;
      for (const cell of cells) {
        if (!cell.isLit) continue;
        if (mouse.isMoving) {
          const dx = cell.col + cell.offsetX - mouse.col;
          const dy = cell.row + cell.offsetY - mouse.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PUSH_RADIUS && dist > 0) {
            const force = (1 - dist / PUSH_RADIUS) ** 2 * PUSH_FORCE;
            cell.velX += (dx / dist) * force;
            cell.velY += (dy / dist) * force;
          }
        }
        cell.velX += -cell.offsetX * SPRING;
        cell.velY += -cell.offsetY * SPRING;
        cell.velX *= DAMPING;
        cell.velY *= DAMPING;
        cell.offsetX += cell.velX;
        cell.offsetY += cell.velY;
        if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01) {
          cell.offsetX = cell.velX = 0;
        } else {
          anyActive = true;
        }
        if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01) {
          cell.offsetY = cell.velY = 0;
        } else {
          anyActive = true;
        }
      }
      if (!anyActive && !mouse.isMoving) isAnimating = false;
    }

    function loop() {
      if (disposed || !isAnimating) {
        animFrameId = null;
        return;
      }
      updatePhysics();
      renderFrame();
      animFrameId = requestAnimationFrame(loop);
    }

    function startLoop() {
      if (disposed || isAnimating) return;
      isAnimating = true;
      animFrameId = requestAnimationFrame(loop);
    }

    function init() {
      if (disposed) return;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      isAnimating = false;
      if (shimmerTimer !== null) {
        clearInterval(shimmerTimer);
        shimmerTimer = null;
      }
      if (!setupCanvas()) return;

      sampleSourceSVG(() => {
        if (disposed) return;
        shimmerTimer = setInterval(() => {
          if (disposed) return;
          for (const cell of cells) {
            if (cell.isLit) cell.char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
          }
          startLoop();
        }, SHIMMER_MS);
        renderFrame();
      });
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.col = (e.clientX - rect.left) / CELL_STEP;
      mouse.row = (e.clientY - rect.top) / CELL_STEP;
      mouse.isMoving = true;
      startLoop();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouse.isMoving = false;
      }, 80);
    }

    function onMouseLeave() {
      mouse.col = mouse.row = -999;
      mouse.isMoving = false;
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(wrap);
    } else {
      window.addEventListener("resize", onResize);
    }

    if (document.fonts) {
      document.fonts.ready.then(init);
    } else {
      init();
    }

    return () => {
      disposed = true;
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", onResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (shimmerTimer !== null) clearInterval(shimmerTimer);
      if (idleTimer !== null) clearTimeout(idleTimer);
      if (resizeTimer !== null) clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: BG_COLOR,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "crosshair",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
