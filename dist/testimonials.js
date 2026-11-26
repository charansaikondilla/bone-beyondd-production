(() => {
  'use strict';
  const track = document.querySelector('#home-stories');
  if (!track) return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const stepSize = () => {
    const card = track.querySelector('.story-card');
    return card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
  };

  // "Read full review" shows the full text in place of the short preview (no repeated text).
  track.querySelectorAll('.story-more').forEach(details => {
    details.addEventListener('toggle', () => {
      details.closest('.story-card')?.classList.toggle('is-expanded', details.open);
    });
  });

  // Continuous, gentle horizontal scrolling. Pauses while the visitor hovers, touches,
  // focuses or reads a full review, and when the section is off-screen.
  const auto = track.hasAttribute('data-autoscroll');
  let paused = false;
  let visible = !('IntersectionObserver' in window);
  let resumeTimer;
  let pos = track.scrollLeft;
  let last = 0;
  let waitUntil = 0;
  let raf = 0;
  const SPEED = 0.035; // pixels per millisecond (~35px per second)

  const pause = () => { paused = true; clearTimeout(resumeTimer); };
  const resumeLater = (delay = 3000) => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; pos = track.scrollLeft; }, delay);
  };

  document.querySelectorAll('[data-stories-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      pause();
      track.scrollBy({left: Number(button.dataset.storiesScroll) * stepSize(), behavior: reduceMotion.matches ? 'auto' : 'smooth'});
      resumeLater(4000);
    });
  });

  if (!auto) return;
  track.style.scrollSnapType = 'none';
  track.style.scrollBehavior = 'auto';
  track.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') pause(); });
  track.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') resumeLater(800); });
  track.addEventListener('touchstart', pause, {passive: true});
  track.addEventListener('touchend', () => resumeLater(3500), {passive: true});
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', () => resumeLater());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[entries.length - 1].isIntersecting; start(); }, {threshold: 0.25}).observe(track);
  }

  function start() {
    if (raf || !visible || document.hidden || reduceMotion.matches) return;
    last = 0;
    pos = track.scrollLeft;
    raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', start);
  reduceMotion.addEventListener?.('change', start);

  function frame(now) {
    if (!visible || document.hidden || reduceMotion.matches) { raf = 0; return; }
    const dt = last ? Math.min(now - last, 50) : 0;
    last = now;
    const busy = paused || !visible || reduceMotion.matches || document.hidden || track.querySelector('.story-more[open]');
    if (!busy && now >= waitUntil) {
      if (Math.abs(track.scrollLeft - pos) > 3) pos = track.scrollLeft; // visitor scrolled manually
      const max = track.scrollWidth - track.clientWidth;
      if (max > 0) {
        if (pos >= max - 1) {
          // Reached the end: pause briefly, then glide back to the first review.
          setTimeout(() => {
            track.style.scrollBehavior = 'smooth';
            track.scrollLeft = 0;
            pos = 0;
            setTimeout(() => { track.style.scrollBehavior = 'auto'; }, 900);
          }, 1500);
          waitUntil = now + 3200;
        } else {
          pos = Math.min(max, pos + dt * SPEED);
          track.scrollLeft = pos;
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }
  start();
})();
