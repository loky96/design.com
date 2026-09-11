/* Slide deck for a case study (see aihub-security-deck.html).
   Markup: .deck-stage holds .slide sections, grouped in [data-chapter] wrappers; .deck-bar holds the controls,
   .deck-menu (<dialog>) lists every slide, .deck-zoom (<dialog>) enlarges any img.zoom.
   A slide's menu label is its data-title, or else its first heading.
   Keys: → ↓ Space PageDown Enter = next · ← ↑ Shift+Space PageUp = back · Home / End · M = slide menu · F = full screen.
   The URL hash is the slide number, so a reload or a shared link (deck.html#12) opens that slide. */

export function initDeck() {
  const W = 1600;
  const H = 900;
  const stage = document.querySelector('.deck-stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const menu = document.querySelector('.deck-menu');
  const zoom = document.querySelector('.deck-zoom');
  const count = document.querySelector('.deck-count');
  const chapterLabel = document.querySelector('.deck-chapter');
  const progress = document.querySelector('.deck-progress span');
  const exitLink = document.querySelector('.deck-exit');
  const chapterOf = (s) => s.closest('[data-chapter]')?.dataset.chapter || '';
  const titleOf = (s) => s.dataset.title || s.querySelector('h1, h2')?.textContent.trim() || '';
  let idx = -1;

  // Scale the fixed canvas to fit the window.
  const fit = () => stage.style.setProperty('--s', Math.min(innerWidth / W, innerHeight / H));
  addEventListener('resize', fit);
  fit();

  // Slide menu, grouped by chapter.
  const list = menu.querySelector('ol');
  let lastChapter = null;
  const links = slides.map((s, i) => {
    const chapter = chapterOf(s);
    if (chapter !== lastChapter) {
      lastChapter = chapter;
      const head = document.createElement('li');
      head.className = 'deck-menu-chapter';
      head.textContent = chapter;
      list.append(head);
    }
    const a = document.createElement('a');
    a.href = `#${i + 1}`;
    a.innerHTML = `<span class="n">${i + 1}</span>`;
    a.append(titleOf(s));
    a.addEventListener('click', (e) => {
      e.preventDefault();
      menu.close();
      go(i);
    });
    const li = document.createElement('li');
    li.append(a);
    list.append(li);
    return a;
  });

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i === idx) return;
    slides[idx]?.querySelectorAll('video').forEach((v) => v.pause());
    slides.forEach((s, n) => {
      s.classList.toggle('is-active', n === i);
      s.classList.toggle('is-before', n < i);
      s.inert = n !== i;
    });
    // Screen recordings play (muted, looping) while their slide is up.
    slides[i].querySelectorAll('video[data-autoplay]').forEach((v) => v.play().catch(() => {}));
    idx = i;
    count.textContent = `${i + 1} / ${slides.length}`;
    chapterLabel.textContent = chapterOf(slides[i]);
    progress.style.width = `${((i + 1) / slides.length) * 100}%`;
    links.forEach((a, n) => (n === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    history.replaceState(null, '', `#${i + 1}`);
  }

  function openMenu() {
    menu.showModal();
    links[idx].focus();
    links[idx].scrollIntoView({ block: 'center' });
  }

  const toggleFullscreen = () =>
    (document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen?.()
    )?.catch(() => {});

  document.querySelector('.deck-prev').addEventListener('click', () => go(idx - 1));
  document.querySelector('.deck-next').addEventListener('click', () => go(idx + 1));
  document.querySelector('.deck-menu-btn').addEventListener('click', openMenu);
  document.querySelector('.deck-fs').addEventListener('click', toggleFullscreen);
  menu.querySelector('.deck-menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); }); // backdrop

  // Came here from the case study? Going back restores its scroll position.
  exitLink.addEventListener('click', (e) => {
    if (document.referrer && new URL(document.referrer).pathname === new URL(exitLink.href).pathname) {
      e.preventDefault();
      history.back();
    }
  });

  // Click a dense image to see it full size.
  const zoomImg = zoom.querySelector('img');
  stage.addEventListener('click', (e) => {
    const img = e.target.closest('img.zoom');
    if (!img) return;
    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt;
    zoom.showModal();
  });
  zoom.addEventListener('click', () => zoom.close());

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || zoom.open) return;
    const k = e.key;
    if (menu.open) {
      if (k === 'm' || k === 'M') menu.close();
      return;
    }
    // A focused video keeps its own seek / pause keys; a focused control keeps Enter and Space.
    if (e.target.closest?.('video') && (k === ' ' || k === 'ArrowLeft' || k === 'ArrowRight')) return;
    if ((k === 'Enter' || k === ' ') && e.target.closest?.('button, a')) return;
    let handled = true;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === 'Enter' || (k === ' ' && !e.shiftKey)) go(idx + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === ' ') go(idx - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'm' || k === 'M') openMenu();
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else handled = false;
    if (handled) e.preventDefault();
  });

  // Swipe on touch screens.
  let x0 = null;
  let y0 = 0;
  addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', (e) => {
    if (x0 === null || menu.open || zoom.open) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
  });

  // Controls and cursor fade out while the presenter isn't using the mouse.
  let idleTimer;
  const wake = () => {
    document.body.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add('is-idle'), 2500);
  };
  addEventListener('pointermove', wake);
  addEventListener('pointerdown', wake);
  wake();

  const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
  addEventListener('hashchange', () => go(fromHash()));
  go(fromHash());
}
