(() => {
  'use strict';
  const track = document.querySelector('#home-stories');
  if (!track) return;
  document.querySelectorAll('[data-stories-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      const card = track.querySelector('.story-card');
      const step = card ? card.getBoundingClientRect().width + 18 : track.clientWidth;
      track.scrollBy({left: Number(button.dataset.storiesScroll) * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
  });
})();
