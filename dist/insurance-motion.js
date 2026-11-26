(() => {
  'use strict';
  // Homepage insurance line: a second (hidden) copy of the logos follows the first,
  // so the CSS animation can loop seamlessly with no jump or gap.
  const track = document.querySelector('.insurance-marquee-track');
  if (!track || track.dataset.ready) return;
  track.dataset.ready = 'true';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const strip = track.querySelector('.insurance-strip');
  if (!strip) return;
  const prepare = () => {
    strip.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    const copy = strip.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(img => { img.alt = ''; });
    track.appendChild(copy);
  };
  // Load the logos shortly before the section is reached, and rest while it is off-screen.
  if (!('IntersectionObserver' in window)) { prepare(); return; }
  let done = false;
  new IntersectionObserver(entries => {
    const near = entries[entries.length - 1].isIntersecting;
    if (near && !done) { done = true; prepare(); }
    track.style.animationPlayState = near ? '' : 'paused';
  }, {rootMargin: '700px 0px'}).observe(track.parentElement);
})();
