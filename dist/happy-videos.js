(() => {
  'use strict';
  const root = document.querySelector('[data-happy-carousel]');
  if (!root) return;
  const track = root.querySelector('.happy-videos');
  const cards = [...track.querySelectorAll('.happy-video')];
  const videos = cards.map(card => card.querySelector('video'));
  const dots = [...root.querySelectorAll('[data-happy-dot]')];
  const prev = root.querySelector('[data-happy-prev]');
  const next = root.querySelector('[data-happy-next]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const AUTO_DELAY = 5000;
  const RESUME_DELAY = 9000;
  let current = -1;
  let visible = !('IntersectionObserver' in window);
  let hovering = false;
  let timer;

  const leftFor = index => cards[index].offsetLeft - (track.clientWidth - cards[index].offsetWidth) / 2;
  const goTo = (index, smooth = true) => track.scrollTo({ left: leftFor(index), behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant' });
  const playing = () => videos.some(video => !video.paused && !video.ended);

  const setCurrent = index => {
    if (index === current) return;
    current = index;
    cards.forEach((card, i) => card.classList.toggle('is-side', i !== index));
    dots.forEach((dot, i) => { if (i === index) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
    videos.forEach((video, i) => {
      video.tabIndex = i === index ? 0 : -1;
      if (i !== index) video.pause();
    });
  };

  const schedule = (delay = AUTO_DELAY) => {
    clearTimeout(timer);
    if (reduceMotion.matches) return;
    timer = setTimeout(() => {
      const busy = !visible || hovering || document.hidden || playing() || root.querySelector(':focus-visible') || document.querySelector('dialog[open]');
      if (!busy) goTo((current + 1) % cards.length);
      schedule();
    }, delay);
  };

  const sync = () => {
    const centre = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    cards.forEach((card, i) => {
      const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
      if (gap < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - centre)) best = i;
    });
    setCurrent(best);
  };

  const step = direction => { goTo((current + direction + cards.length) % cards.length); schedule(RESUME_DELAY); };
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); schedule(RESUME_DELAY); }));
  cards.forEach((card, i) => card.addEventListener('click', event => {
    if (i === current) return;
    event.preventDefault();
    goTo(i);
    schedule(RESUME_DELAY);
  }));
  videos.forEach((video, i) => {
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
      if (i !== current) goTo(i);
    });
    video.addEventListener('ended', () => schedule(RESUME_DELAY));
  });

  let frame;
  track.addEventListener('scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(sync); }, { passive: true });
  track.addEventListener('touchstart', () => schedule(RESUME_DELAY), { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovering = true; });
  root.addEventListener('pointerleave', () => { hovering = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting;
      if (!visible) videos.forEach(video => { if (!document.fullscreenElement && document.pictureInPictureElement !== video) video.pause(); });
    }, { threshold: 0.2 }).observe(root);
  }
  // Keep the same video centred when the screen is rotated or resized.
  if ('ResizeObserver' in window) {
    let width = track.clientWidth;
    new ResizeObserver(() => {
      if (track.clientWidth === width) return;
      width = track.clientWidth;
      if (!document.fullscreenElement) goTo(current, false);
    }).observe(track);
  }
  // Pages using reduced motion can change the setting while open.
  reduceMotion.addEventListener?.('change', () => schedule());

  root.classList.add('is-ready');
  goTo(Math.floor(cards.length / 2), false);
  sync();
  schedule();
})();
