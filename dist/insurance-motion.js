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
  const copy = strip.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('img').forEach(img => { img.alt = ''; img.loading = 'eager'; });
  track.appendChild(copy);
})();
