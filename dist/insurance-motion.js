(() => {
  const list = document.querySelector('.insurance-logos');
  if (!list || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  list.querySelectorAll('li').forEach((tile, index) => tile.style.setProperty('--logo-delay', `${(index % 6) * 55}ms`));
  const observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      list.classList.add('motion-enter');
      observer.disconnect();
    }
  }, { threshold: 0.12 });
  observer.observe(list);
})();
