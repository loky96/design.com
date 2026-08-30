/* Image side-view gallery: scroll track by one item width per arrow click,
   and keep a row of dots in sync with the currently visible item. */

export function initImgGalleries() {
  document.querySelectorAll('.img-side-gallery').forEach((gallery) => {
    const track = gallery.querySelector('.img-gallery-track');
    const prevBtn = gallery.querySelector('.img-gallery-arrow.prev');
    const nextBtn = gallery.querySelector('.img-gallery-arrow.next');
    const dotsWrap = gallery.querySelector('.img-gallery-dots');
    if (!track) return;

    const items = Array.from(track.querySelectorAll('.img-gallery-item'));

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
