/* Image side-view gallery: scroll track by one item width per arrow click,
   and keep a row of dots in sync with the currently visible item.
   Clicking an image opens that gallery in a full-screen <dialog> lightbox. */

let lightbox = null;

function getLightbox() {
  if (lightbox) return lightbox;
  const dlg = document.createElement('dialog');
  dlg.className = 'img-lightbox';
  dlg.setAttribute('aria-label', 'Image viewer');
  dlg.innerHTML = `
    <button type="button" class="img-lightbox-close" aria-label="Close">&times;</button>
    <button type="button" class="img-lightbox-arrow prev" aria-label="Previous image">&#8249;</button>
    <div class="img-lightbox-track"></div>
    <button type="button" class="img-lightbox-arrow next" aria-label="Next image">&#8250;</button>`;
  document.body.appendChild(dlg);

  const track = dlg.querySelector('.img-lightbox-track');
  const prev = dlg.querySelector('.prev');
  const next = dlg.querySelector('.next');
  const state = { current: 0 };
  const syncArrows = () => {
    prev.disabled = state.current <= 0;
    next.disabled = state.current >= track.children.length - 1;
  };
  // Absolute scrollTo (not scrollBy): images decoding right after open re-snap the
  // track, which cancels a relative smooth scroll that's already in flight.
  const goTo = (i, behavior = 'smooth') => {
    state.current = Math.max(0, Math.min(track.children.length - 1, i));
    track.scrollTo({ left: state.current * track.clientWidth, behavior });
    syncArrows();
  };
  const step = (dir) => goTo(state.current + dir);
  // Sync after scrolling settles (swipe/trackpad), not mid-animation, so quick
  // repeated arrow presses keep advancing from the target, not an in-between frame.
  let settle;
  track.addEventListener('scroll', () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      state.current = Math.round(track.scrollLeft / track.clientWidth);
      syncArrows();
    }, 120);
  }, { passive: true });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dlg.querySelector('.img-lightbox-close').addEventListener('click', () => dlg.close());
  // Clicks on the dark area (dialog itself or empty slide space) close it; clicks on the image or caption don't.
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg || e.target.classList.contains('img-lightbox-slide')) dlg.close();
  });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    // Native Esc-to-close can be skipped when the dialog opened without user activation.
    if (e.key === 'Escape') { e.preventDefault(); dlg.close(); }
  });

  lightbox = { dlg, track, goTo };
  return lightbox;
}

function captionText(item) {
  const cap = item.querySelector('.img-gallery-caption');
  if (!cap) return '';
  const clone = cap.cloneNode(true);
  clone.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

function openLightbox(slides, index) {
  const { dlg, track, goTo } = getLightbox();
  track.replaceChildren(...slides.map((item) => {
    const src = item.querySelector('img');
    const fig = document.createElement('figure');
    fig.className = 'img-lightbox-slide';
    const img = document.createElement('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    fig.appendChild(img);
    const text = captionText(item);
    if (text) {
      const cap = document.createElement('figcaption');
      cap.textContent = text;
      fig.appendChild(cap);
    }
    return fig;
  }));
  dlg.classList.toggle('single', slides.length < 2);
  dlg.showModal();
  goTo(index, 'instant');
}

export function initImgGalleries() {
  document.querySelectorAll('.img-side-gallery').forEach((gallery) => {
    const track = gallery.querySelector('.img-gallery-track');
    const prevBtn = gallery.querySelector('.img-gallery-arrow.prev');
    const nextBtn = gallery.querySelector('.img-gallery-arrow.next');
    const dotsWrap = gallery.querySelector('.img-gallery-dots');
    if (!track) return;

    const items = Array.from(track.querySelectorAll('.img-gallery-item'));

    const slides = items.filter((item) => item.querySelector('img'));
    slides.forEach((item, i) => {
      const img = item.querySelector('img');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Open larger view: ${img.alt}`);
      img.addEventListener('click', () => openLightbox(slides, i));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(slides, i); }
      });
    });

    function itemStep() {
      const item = items[0];
      return item ? item.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    }

    function scrollByAmount(dir) {
      track.scrollBy({ left: dir * itemStep(), behavior: 'smooth' });
    }

    prevBtn && prevBtn.addEventListener('click', () => scrollByAmount(-1));
    nextBtn && nextBtn.addEventListener('click', () => scrollByAmount(1));

    if (!dotsWrap || items.length === 0) return;

    const dots = items.map((item, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'img-gallery-dot';
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    dots[0].classList.add('active');

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        items.forEach((item, i) => {
          const itemCenter = item.offsetLeft - track.offsetLeft + item.clientWidth / 2;
          const dist = Math.abs(itemCenter - center);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === closest));
        ticking = false;
      });
    }, { passive: true });
  });
}
