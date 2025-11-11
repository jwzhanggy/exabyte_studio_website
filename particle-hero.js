// ===== EXABYTE STUDIO - 3D PARTICLE HERO ANIMATION =====
// Gold + Purple particle text with 3D rotation and mouse interaction

(function() {
  // ===== CONFIGURATION =====
  const TEXT_VALUE = "EXABYTE STUDIO";

  // Appearance
  const PARTICLE_SIZE_SCALE = 1.0;
  const PARTICLE_DENSITY_SCALE = 4.0;
  const EXTRUSION_DEPTH = 80;
  const TEXT_SIZE_FACTOR = 8;
  const TEXT_FIT_WIDTH_RATIO = 0.50;
  const TEXT_FIT_HEIGHT_RATIO = 0.6;

  // Camera
  const FOV = 1200;
  const BASE_CAMERA_Z = 1400;

  // Mask face (pseudo 3D)
  const FACE_LAYERS = 8;
  const FACE_LAYER_SHIFT_PX = 1.0;

  // Mouse scatter
  const MOUSE_REPEL_RADIUS = 90;
  const MOUSE_FORCE_SCALE = 2.0;

  // ===== SETUP =====
  const canvas = document.getElementById("scene");
  if (!canvas) {
    console.error("Canvas with id 'scene' not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  const colors = ["#FFB300","#FFD54F","#FF8F00","#4D0099","#7E57C2","#B388FF"];

  let particles = [];
  let amount = 0;

  // Interaction
  let isPointerDown = false, lastX = 0, lastY = 0;
  let rotX = 0, rotY = 0, zoom = 1.0;
  const minZoom = 0.5, maxZoom = 4.0; // Match original exabyte_studio.html zoom range
  let mouse = { x: -9999, y: -9999 };

  // Scroll-based zoom control
  let scrollProgress = 0; // 0 = max zoom, 1 = min zoom
  let accumulatedScroll = 0; // Signed accumulated scroll (positive = down, negative = up)
  const scrollZoomRange = 1000; // wheel delta needed for full zoom range

  // ===== PARTICLE CLASS =====
  class Particle3D {
    constructor(x, y, z) {
      this.x = (Math.random() - 0.5) * canvas.width;
      this.y = (Math.random() - 0.5) * canvas.height;
      this.z = (Math.random() - 0.5) * EXTRUSION_DEPTH;
      this.dest = { x, y, z };

      this.vx = (Math.random() - 0.5) * 15;
      this.vy = (Math.random() - 0.5) * 15;
      this.vz = (Math.random() - 0.5) * 15;
      this.accX = 0;
      this.accY = 0;
      this.accZ = 0;
      this.friction = Math.random() * 0.05 + 0.93;

      const base = 1.0 + Math.random() * 4.0;
      this.r = base * PARTICLE_SIZE_SCALE;

      this.ax = 0.65 + Math.random() * 0.70;
      this.ay = 0.65 + Math.random() * 0.70;
      this.theta = Math.random() * Math.PI;

      this.alpha = 0.4 + Math.random() * 0.6;
      this.color = colors[(Math.random() * colors.length) | 0];
    }

    integrate() {
      this.accX = (this.dest.x - this.x) / 1000;
      this.accY = (this.dest.y - this.y) / 1000;
      this.accZ = (this.dest.z - this.z) / 1000;
      this.vx = (this.vx + this.accX) * this.friction;
      this.vy = (this.vy + this.accY) * this.friction;
      this.vz = (this.vz + this.accZ) * this.friction;
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
    }
  }

  // ===== RESIZE & SETUP =====
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const cssW = window.innerWidth, cssH = window.innerHeight;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildModelFromText();
  }

  function fittedFontSize(text, w, h) {
    let size = Math.max(24, w / TEXT_SIZE_FACTOR);
    ctx.font = `bold ${size}px sans-serif`;
    const m = ctx.measureText(text);
    const rawW = m.width || (text.length * size * 0.6);
    const asc = m.actualBoundingBoxAscent ?? size * 0.78;
    const desc = m.actualBoundingBoxDescent ?? size * 0.22;
    const rawH = asc + desc;

    const extra = FACE_LAYERS * FACE_LAYER_SHIFT_PX;
    const maxW = w * TEXT_FIT_WIDTH_RATIO - extra;
    const maxH = h * TEXT_FIT_HEIGHT_RATIO - extra;

    const scale = Math.min(maxW / rawW, maxH / rawH);
    return Math.max(12, size * scale);
  }

  function drawMaskTextToBuffer(w, h, text) {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const size = fittedFontSize(text, w, h);
    ctx.font = `bold ${size}px sans-serif`;

    const totalShift = FACE_LAYERS * FACE_LAYER_SHIFT_PX;
    const baseX = w / 2 - totalShift / 2;
    const baseY = h / 2 - totalShift / 2;

    for (let d = FACE_LAYERS; d > 0; d--) {
      const shade = Math.floor(20 + (d / FACE_LAYERS) * 80);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillText(text, baseX + d * FACE_LAYER_SHIFT_PX, baseY + d * FACE_LAYER_SHIFT_PX);
    }

    const grad = ctx.createLinearGradient(w / 2, h / 2 - size * 0.4, w / 2, h / 2 + size * 0.4);
    grad.addColorStop(0, "#FFF");
    grad.addColorStop(1, "#AAA");
    ctx.fillStyle = grad;
    ctx.fillText(text, baseX, baseY);
  }

  function buildModelFromText() {
    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawMaskTextToBuffer(W, H, TEXT_VALUE);
    const data = ctx.getImageData(0, 0, W, H).data;
    ctx.clearRect(0, 0, W, H);
    ctx.restore();

    particles = [];

    const BASE_SAMPLES_PER_AXIS = 220;
    const step = Math.max(1, Math.round(W / (BASE_SAMPLES_PER_AXIS * PARTICLE_DENSITY_SCALE)));

    const halfW = W / 2, halfH = H / 2;
    for (let i = 0; i < W; i += step) {
      for (let j = 0; j < H; j += step) {
        const a = data[(i + j * W) * 4 + 3];
        if (a > 150) {
          const x = i - halfW;
          const y = j - halfH;
          const z = (Math.random() - 0.5) * EXTRUSION_DEPTH;
          particles.push(new Particle3D(x, y, z));
        }
      }
    }
    amount = particles.length;
  }

  // ===== 3D TRANSFORMS =====
  function rotatePoint(p, rx, ry) {
    const cosy = Math.cos(ry), siny = Math.sin(ry);
    let x = p.x * cosy + p.z * siny;
    let z = -p.x * siny + p.z * cosy;
    const cosx = Math.cos(rx), sinx = Math.sin(rx);
    let y = p.y * cosx - z * sinx;
    z = p.y * sinx + z * cosx;
    return { x, y, z };
  }

  function project(point, cx, cy) {
    const camZ = BASE_CAMERA_Z / zoom;
    const z = camZ - point.z;
    const scale = FOV / Math.max(1, z);
    return { x: cx + point.x * scale, y: cy + point.y * scale, z, scale };
  }

  // ===== RENDER LOOP =====
  function render() {
    requestAnimationFrame(render);
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // Physics
    for (let i = 0; i < amount; i++) particles[i].integrate();

    const cx = w / 2, cy = h / 2;
    const screenPts = new Array(amount);

    for (let i = 0; i < amount; i++) {
      const p = particles[i];
      const rot = rotatePoint(p, rotX, rotY);
      const proj = project(rot, cx, cy);

      // Mouse repulsion
      const dxs = proj.x - mouse.x, dys = proj.y - mouse.y;
      const dist = Math.hypot(dxs, dys);
      if (dist < MOUSE_REPEL_RADIUS) {
        const k = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
        let xr = (dxs / (proj.scale || 1)), yr = (dys / (proj.scale || 1)), zr = 0;
        const cosx = Math.cos(-rotX), sinx = Math.sin(-rotX);
        let y0 = yr * cosx - zr * sinx, z0 = yr * sinx + zr * cosx;
        const cosy = Math.cos(-rotY), siny = Math.sin(-rotY);
        let xObj = xr * cosy + z0 * siny, zObj = -xr * siny + z0 * cosy, yObj = y0;
        const invLen = 1 / (Math.hypot(xObj, yObj, zObj) || 1);
        p.vx += (xObj * invLen) * k * MOUSE_FORCE_SCALE;
        p.vy += (yObj * invLen) * k * MOUSE_FORCE_SCALE;
        p.vz += (zObj * invLen) * k * MOUSE_FORCE_SCALE;
      }

      const sizeScale = Math.min(2.0, Math.max(0.5, proj.scale));
      screenPts[i] = {
        sx: proj.x, sy: proj.y, z: proj.z,
        r: p.r * sizeScale,
        ax: p.ax, ay: p.ay, theta: p.theta,
        color: p.color, alpha: p.alpha
      };
    }

    // Draw far to near
    screenPts.sort((a, b) => b.z - a.z);
    for (const s of screenPts) {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.ellipse(s.sx, s.sy, s.r * s.ax, s.r * s.ay, s.theta, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ===== INTERACTION HANDLERS =====
  function setViewPresetFront() {
    rotX = 0;
    rotY = 0;
    zoom = 1.0; // Start at zoom = 1.0 (middle position, matching original)
    // Calculate initial scroll position for zoom = 1.0
    // zoom = maxZoom - (maxZoom - minZoom) * scrollProgress
    // 1.0 = 4.0 - (4.0 - 0.5) * scrollProgress
    // scrollProgress = (4.0 - 1.0) / 3.5 = 0.857
    scrollProgress = (maxZoom - 1.0) / (maxZoom - minZoom);
    accumulatedScroll = scrollProgress * scrollZoomRange;
  }

  function onPointerDown(e) {
    isPointerDown = true;
    lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
  }

  function onPointerMove(e) {
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    if(isPointerDown) {
      const dx = x - lastX, dy = y - lastY;
      rotY += dx * 0.005;
      rotX += dy * 0.005;
      rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
      lastX = x;
      lastY = y;
    }

    // Disable mouse repulsion when page is scrolled down
    // This prevents particles from being affected when mouse is over content below
    if (window.scrollY > 0) {
      mouse.x = -9999;
      mouse.y = -9999;
    } else {
      mouse.x = x;
      mouse.y = y;
    }
  }

  function onPointerUp() {
    isPointerDown = false;
  }

  function onWheel(e) {
    const delta = e.deltaY;

    // If page is scrolled down (not at top), allow normal page scroll behavior
    // Particle zoom is ONLY controlled when page is at the very top
    if (window.scrollY > 0) {
      // Don't prevent default, don't modify particle zoom
      // This allows normal page scroll up/down when viewing content below particles
      return;
    }

    // Page is at top (scrollY = 0), control particle zoom
    const isScrollingDown = delta > 0;
    const isScrollingUp = delta < 0;

    // Accumulate scroll with sign (positive = down/zoom out, negative = up/zoom in)
    accumulatedScroll += delta;

    // Clamp accumulated scroll to valid range [0, scrollZoomRange]
    // 0 = max zoom (fully zoomed in)
    // scrollZoomRange = min zoom (fully zoomed out)
    accumulatedScroll = Math.max(0, Math.min(scrollZoomRange, accumulatedScroll));

    // Calculate scroll progress (0 to 1)
    scrollProgress = accumulatedScroll / scrollZoomRange;

    // Map to zoom (maxZoom when progress=0, minZoom when progress=1)
    zoom = maxZoom - (maxZoom - minZoom) * scrollProgress;

    // Determine if we should prevent default scroll
    let shouldPreventScroll = false;

    if (isScrollingDown) {
      // Scrolling down: prevent default if we haven't reached min zoom yet
      if (scrollProgress < 0.99) {
        shouldPreventScroll = true;
      }
      // Once at min zoom (progress >= 0.99), allow page to scroll down to show content
    } else if (isScrollingUp) {
      // Scrolling up: prevent default if we haven't reached max zoom yet
      if (scrollProgress > 0.01) {
        shouldPreventScroll = true;
      }
      // Once at max zoom (progress <= 0.01), allow default (no effect since at top)
    }

    if (shouldPreventScroll) {
      e.preventDefault();
    }
  }

  function onDblClick() {
    // Reset zoom and scroll to initial state
    rotX = 0;
    rotY = 0;
    zoom = 1.0;
    scrollProgress = (maxZoom - 1.0) / (maxZoom - minZoom);
    accumulatedScroll = scrollProgress * scrollZoomRange;
    window.scrollTo(0, 0);
  }

  // ===== EVENT LISTENERS =====
  window.addEventListener("resize", resize);
  window.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp);
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("dblclick", onDblClick);

  // ===== INITIALIZE =====
  setViewPresetFront();
  resize();
  requestAnimationFrame(render);
})();
