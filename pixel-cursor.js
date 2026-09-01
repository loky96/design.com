/* ═══════════════════════════════════════════════════════════════
   Pixel-trail cursor — spring-physics dot trail replacing the
   native cursor across the whole page.
   Ported from a React/Framer-Motion component (Originkit) to plain
   JS (this site has no build step / no React). A pool of trailing
   dots chases the pointer with a damped spring; the trail stays
   fully visible at rest (idle fade removed).
   ═══════════════════════════════════════════════════════════════ */

const FOLLOW_SPEED = 10;
const STIFFNESS = 10;
const DAMPING = 10;

/**
 * initPixelCursor(options) → { destroy() }
 * options: { pixelCount, pixelSize, pixelShape, trailColor, trailStyle, trailSpacing }
 */
export function initPixelCursor(options = {}) {
  const opts = {
    pixelCount: 30,
    pixelSize: 10,
    pixelShape: 'circle',
    trailColor: '#393939',
    trailStyle: 'solid',
    trailSpacing: 2,
    ...options,
  };

  if (!window.matchMedia('(pointer: fine)').matches) return { destroy() {} };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { destroy() {} };

  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;inset:0;z-index:9999;overflow:hidden;opacity:0;pointer-events:none;mix-blend-mode:difference;';
  document.body.appendChild(host);

  const isArrow = opts.pixelShape === 'arrow';
  const rotateDeg = opts.pixelShape === 'square' ? 45 : 0;
  const arrowSvg = (size) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="M6 18L18 6M18 6H9M18 6V15" stroke="${opts.trailColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

  const pool = [];
  for (let i = 0; i < Math.max(1, opts.pixelCount); i++) {
    const node = document.createElement('div');
    if (isArrow) {
      node.style.cssText = `position:absolute;left:0;top:0;will-change:transform,opacity;display:none;`;
      node.innerHTML = arrowSvg(opts.pixelSize);
    } else {
      node.style.cssText = `position:absolute;left:0;top:0;will-change:transform,opacity;width:${opts.pixelSize}px;height:${opts.pixelSize}px;box-sizing:border-box;border-radius:${opts.pixelShape === 'circle' ? '50%' : '30%'};border:2px solid ${opts.trailColor};background-color:transparent;display:none;`;
    }
    host.appendChild(node);
    pool.push({ node, x: -1000, y: -1000, vx: 0, vy: 0, hidden: true });
  }

  const ring = document.createElement('div');
  if (isArrow) {
    ring.style.cssText = `position:absolute;left:0;top:0;will-change:transform,opacity;opacity:0;transition:opacity 0.18s ease;`;
    ring.innerHTML = arrowSvg(opts.pixelSize * 1.4);
  } else {
    ring.style.cssText = `position:absolute;left:0;top:0;will-change:transform,opacity;width:${opts.pixelSize * 1.4}px;height:${opts.pixelSize * 1.4}px;border-radius:30%;border:2px solid ${opts.trailColor};background-color:transparent;box-sizing:border-box;opacity:0;transition:opacity 0.18s ease;`;
  }
  host.appendChild(ring);

  const cursor = { x: -1000, y: -1000 };
  let seen = false;
  let cursorHidden = false;
  let hoveringClickable = false;
  const prevCursor = document.documentElement.style.cursor;
  const CLICKABLE_SELECTOR = 'a, button, [role="button"], input, select, textarea, label, summary, [onclick], [tabindex]:not([tabindex="-1"])';

  function onOver(e) {
    if (e.target.closest && e.target.closest(CLICKABLE_SELECTOR)) {
      hoveringClickable = true;
      host.style.opacity = '0';
    }
  }
  function onOut(e) {
    if (e.target.closest && e.target.closest(CLICKABLE_SELECTOR) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(CLICKABLE_SELECTOR))) {
      hoveringClickable = false;
    }
  }
  document.addEventListener('pointerover', onOver, { passive: true });
  document.addEventListener('pointerout', onOut, { passive: true });

  const cursorStyleTag = document.createElement('style');
  const CLICKABLE_DESCENDANTS = CLICKABLE_SELECTOR.split(',').map((s) => s.trim() + ' *').join(', ');
  cursorStyleTag.textContent = `* { cursor: none !important; } ${CLICKABLE_SELECTOR}, ${CLICKABLE_DESCENDANTS} { cursor: pointer !important; }`;

  function hideNativeCursor(hide) {
    if (hide === cursorHidden) return;
    cursorHidden = hide;
    document.documentElement.style.cursor = hide ? 'none' : prevCursor;
    if (hide) {
      document.head.appendChild(cursorStyleTag);
    } else if (cursorStyleTag.parentNode) {
      cursorStyleTag.parentNode.removeChild(cursorStyleTag);
    }
  }

  function onMove(e) {
    const x = e.clientX;
    const y = e.clientY;
    cursor.x = x;
    cursor.y = y;
    host.style.opacity = (document.body.classList.contains('pixel-cursor-hidden') || hoveringClickable) ? '0' : '1';
    hideNativeCursor(true);
    if (!seen) {
      seen = true;
      pool.forEach((p) => { p.x = x; p.y = y; p.vx = 0; p.vy = 0; });
    }
  }

  function onLeave() {
    hideNativeCursor(false);
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  let last = performance.now();
  let rafId = null;

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;

    if (!seen) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    const fadeMul = 0.7;

    const k = STIFFNESS * 72 * (FOLLOW_SPEED / 10);
    const retain = Math.max(0.05, 1 - DAMPING / 20);
    const decay = Math.pow(retain, dt * 60);
    const pull = 1 - Math.exp(-dt / 0.028);
    const spacing = Math.max(1, opts.trailSpacing);

    for (let i = 0; i < pool.length; i++) {
      const px = pool[i];
      const ax = i === 0 ? cursor.x : pool[i - 1].x;
      const ay = i === 0 ? cursor.y : pool[i - 1].y;
      const dx = ax - px.x;
      const dy = ay - px.y;

      px.vx = (px.vx + dx * k * dt) * decay;
      px.vy = (px.vy + dy * k * dt) * decay;
      px.x += px.vx * dt;
      px.y += px.vy * dt;

      if (i > 0) {
        const dist = Math.hypot(dx, dy);
        if (dist > spacing) {
          const ratio = ((dist - spacing) / dist) * pull;
          px.x += dx * ratio;
          px.y += dy * ratio;
        }
      }

      const progress = i / pool.length;
      let opacity = (1 - progress) * fadeMul;
      let scale = (1 - progress * 0.5) * fadeMul;
      const visible = opts.trailStyle === 'dashed' ? i % 5 < 3 : true;

      let offX = 0, offY = 0;
      if (i > 0 && opts.trailStyle === 'wave') {
        const prev = pool[i - 1];
        const sx = px.x - prev.x, sy = px.y - prev.y;
        const len = Math.hypot(sx, sy);
        if (len > 0) {
          const amount = Math.sin(i * 0.3) * opts.pixelSize * 2;
          offX = (-sy / len) * amount;
          offY = (sx / len) * amount;
        }
      }

      const s = px.node.style;
      const hide = !visible || opacity < 0.01 || scale <= 0;
      if (hide !== px.hidden) {
        s.display = hide ? 'none' : 'block';
        px.hidden = hide;
      }
      if (hide) continue;

      s.transform = `translate(${px.x + offX}px, ${px.y + offY}px) translate(-50%, -50%) scale(${scale}) rotate(${rotateDeg}deg)`;
      s.opacity = String(opacity);
    }

    const ringScale = 1;
    ring.style.transform = `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%) scale(${ringScale}) rotate(${rotateDeg}deg)`;

    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      hideNativeCursor(false);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      host.remove();
    },
  };
}
