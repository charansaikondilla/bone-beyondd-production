(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const boneParts = [
    'M30 9.5H17.2C14.5 9.5 13.7 4 9 4 4.6 4 3.4 8.5 5.9 11.2c-4.2 1.5-4.1 7.8.1 9.2C3.5 23.2 5 28 9.2 28c4.6 0 5.2-5.5 8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z',
    'M30 9.5h16.8c2.7 0 3.5-5.5 8.2-5.5 4.4 0 5.6 4.5 3.1 7.2 4.2 1.5 4.1 7.8-.1 9.2 2.5 2.8 1 7.6-3.2 7.6-4.6 0-5.2-5.5-8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z'
  ];
  const candidates = [...document.querySelectorAll('a.button[href*="#consultation"]')].filter(el => /book\s+(a\s+)?consultation/i.test(el.textContent));
  document.querySelectorAll('a.care-secondary[href="#services"]').forEach(el => candidates.push(el));
  candidates.forEach(link => {
    const isService = link.classList.contains('care-secondary');
    link.classList.add('bone-action', isService ? 'bone-break-action' : 'bone-heal-action');
    const liquid = document.createElement('span');
    liquid.className = 'bone-action-liquid';
    liquid.setAttribute('aria-hidden', 'true');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox','0 0 64 32');
    icon.setAttribute('aria-hidden','true');
    icon.setAttribute('focusable','false');
    icon.classList.add('bone-action-icon');
    boneParts.forEach((part, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d',part);
      path.classList.add('bone-action-piece', i === 0 ? 'bone-action-left' : 'bone-action-right');
      icon.append(path);
    });
    const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sparkle.setAttribute('d', 'M32 3v3M32 26v3M25 5l2 3M39 5l-2 3');
    sparkle.classList.add('bone-action-repair');
    icon.append(sparkle);
    const text = document.createElement('span');
    text.className = 'bone-action-label';
    while (link.firstChild) text.append(link.firstChild);
    link.append(liquid, icon, text);
    let pending = false;
    let hovered = false;
    let playing = false;
    let finishTimer;
    const reset = () => {
      clearTimeout(finishTimer);
      link.classList.remove('bone-action-replay');
      playing = false;
    };
    const play = () => {
      reset();
      // Restart the complete animation, including when a click follows hover.
      void link.offsetWidth;
      playing = true;
      link.classList.add('bone-action-replay');
      finishTimer = window.setTimeout(() => {
        playing = false;
        if (!hovered && !pending) reset();
      }, 1800);
    };
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch' || reduceMotion.matches) return;
      hovered = true;
      if (!pending) play();
    });
    link.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hovered = false;
      if (!pending && !playing) reset();
    });
    link.addEventListener('focus', () => {
      if (!pending && !reduceMotion.matches && link.matches(':focus-visible')) play();
    });
    link.addEventListener('blur', () => { if (!playing && !pending) reset(); });
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      if (reduceMotion.matches) return;
      event.preventDefault();
      if (pending) return;
      pending = true;
      play();
      window.setTimeout(() => { window.location.href = link.href; }, 1850);
    });
    window.addEventListener('pageshow', () => { pending = false; hovered = false; reset(); });
  });
})();
