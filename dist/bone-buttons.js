(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const boneParts = [
    'M30 9.5H17.2C14.5 9.5 13.7 4 9 4 4.6 4 3.4 8.5 5.9 11.2c-4.2 1.5-4.1 7.8.1 9.2C3.5 23.2 5 28 9.2 28c4.6 0 5.2-5.5 8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z',
    'M30 9.5h16.8c2.7 0 3.5-5.5 8.2-5.5 4.4 0 5.6 4.5 3.1 7.2 4.2 1.5 4.1 7.8-.1 9.2 2.5 2.8 1 7.6-3.2 7.6-4.6 0-5.2-5.5-8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z'
  ];
  const candidates = [...document.querySelectorAll('a[href*="#consultation"]')].filter(el => /book\s+(a\s+)?consultation/i.test(el.textContent));
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
      if (event.pointerType === 'touch') return;
      hovered = true;
      if (!pending) play();
    });
    link.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hovered = false;
      if (!pending && !playing) reset();
    });
    link.addEventListener('focus', () => {
      if (!pending && link.matches(':focus-visible')) play();
    });
    link.addEventListener('blur', () => { if (!playing && !pending) reset(); });
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      event.preventDefault();
      if (pending) return;
      pending = true;
      play();
      window.setTimeout(() => { window.location.href = link.href; }, 1850);
    });
    window.addEventListener('pageshow', () => { pending = false; hovered = false; reset(); });
  });
})();
const actionMotionStyle = document.createElement('style');
actionMotionStyle.textContent = `.button,.call-outline,.banner-button,.consult-actions a,.service-actions a{position:relative;overflow:hidden;isolation:isolate;transition:transform .25s ease,box-shadow .25s ease,filter .25s ease}.button:before,.call-outline:before,.banner-button:before,.consult-actions a:before,.service-actions a:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 18%,#fff8 48%,transparent 78%);transform:translateX(-120%);animation:button-sheen 3.6s ease-in-out infinite}.button:hover,.button:focus-visible,.call-outline:hover,.call-outline:focus-visible,.banner-button:hover,.banner-button:focus-visible,.consult-actions a:hover,.consult-actions a:focus-visible,.service-actions a:hover,.service-actions a:focus-visible{transform:translateY(-3px);filter:brightness(1.06);box-shadow:0 12px 26px #075cbd38}.button:active,.call-outline:active,.banner-button:active,.consult-actions a:active,.service-actions a:active{transform:translateY(-1px) scale(.98)}@keyframes button-sheen{0%,30%{transform:translateX(-120%)}70%,100%{transform:translateX(120%)}}@media(max-width:600px){.button:before,.call-outline:before,.banner-button:before,.consult-actions a:before,.service-actions a:before{animation-duration:3s}.button,.call-outline,.banner-button,.consult-actions a,.service-actions a{min-height:48px}}@media(prefers-reduced-motion:reduce){.button:before,.call-outline:before,.banner-button:before,.consult-actions a:before,.service-actions a:before{animation:none}.button,.call-outline,.banner-button,.consult-actions a,.service-actions a{transition:none}.button:hover,.button:focus-visible,.call-outline:hover,.call-outline:focus-visible,.banner-button:hover,.banner-button:focus-visible,.consult-actions a:hover,.consult-actions a:focus-visible,.service-actions a:hover,.service-actions a:focus-visible{transform:none}}`;
document.head.appendChild(actionMotionStyle);
const interactionStateStyle = document.createElement('style');
interactionStateStyle.textContent = `.interactive-action{position:relative;isolation:isolate;will-change:transform,box-shadow;animation:action-idle-pulse 3.2s ease-in-out infinite}.interactive-action:before{display:none!important}.interactive-action:after{content:"";position:absolute;inset:2px;z-index:1;border-radius:inherit;pointer-events:none;background:linear-gradient(105deg,transparent 18%,#fff9 46%,transparent 72%);transform:translateX(-135%);animation:action-sheen 3.8s ease-in-out infinite}.interactive-action>*{position:relative;z-index:2}.interactive-action:hover,.interactive-action:focus-visible{transform:translateY(-3px);box-shadow:0 13px 30px #075cbd45;animation-play-state:paused}.interactive-action:active,.interactive-action.is-pressed{transform:translateY(-1px) scale(.975);box-shadow:0 5px 12px #075cbd38}.interactive-action.is-clicked{animation:action-click .48s ease both}.interactive-action:focus-visible{outline:3px solid #67b7ff;outline-offset:4px}@keyframes action-idle-pulse{0%,100%{filter:brightness(1);box-shadow:0 7px 17px #075cbd18}50%{filter:brightness(1.035);box-shadow:0 11px 24px #075cbd2e}}@keyframes action-sheen{0%,36%{transform:translateX(-135%)}72%,100%{transform:translateX(135%)}}@keyframes action-click{0%{transform:scale(1)}45%{transform:scale(.95)}100%{transform:scale(1)}}@media(prefers-reduced-motion:reduce){.interactive-action{animation:none}.interactive-action:after{animation:none}.interactive-action.is-clicked{animation:none}.interactive-action:hover,.interactive-action:focus-visible{transform:none}}`;
document.head.appendChild(interactionStateStyle);

const interactiveSelectors = '.button, .call-outline, .banner-button, .consult-actions a, .service-actions a, .ref-button, .experience-action, .about-more summary, .service-more a, .video-filter, .bb-chat-launch';
document.querySelectorAll(interactiveSelectors).forEach((control) => {
  control.classList.add('interactive-action');
  control.addEventListener('pointerdown', () => control.classList.add('is-pressed'));
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => control.addEventListener(eventName, () => control.classList.remove('is-pressed')));
  control.addEventListener('click', () => {
    control.classList.remove('is-clicked');
    void control.offsetWidth;
    control.classList.add('is-clicked');
  });
  control.addEventListener('animationend', (event) => {
    if (event.animationName === 'action-click') control.classList.remove('is-clicked');
  });
});
