/* nav-scroll.js — Hide navbar on scroll down / reveal on scroll up + Idle fade out */
(function initNavBehavior() {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var lastScrollY = window.scrollY;
  var ticking = false;
  var scrollThreshold = 6;
  var idleTimer = null;
  var IDLE_DELAY = 1800; // 1.8 seconds of inactivity -> fade out

  // Hide/reveal on scroll
  function updateNav() {
    var currentScrollY = window.scrollY;

    if (currentScrollY <= 60) {
      nav.classList.remove('nav-hidden');
    } else if (currentScrollY > lastScrollY + scrollThreshold) {
      nav.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY - scrollThreshold) {
      nav.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    resetIdleTimer();
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Idle fade out management
  function resetIdleTimer() {
    if (nav.classList.contains('nav-idle')) {
      nav.classList.remove('nav-idle');
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!nav.matches(':hover')) {
        nav.classList.add('nav-idle');
      }
    }, IDLE_DELAY);
  }

  // Activity listeners to bring menu back on interaction
  var activityEvents = ['mousemove', 'mousedown', 'touchstart', 'keydown'];
  activityEvents.forEach(function (evt) {
    window.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
})();
