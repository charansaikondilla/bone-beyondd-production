(() => {
  'use strict';
  const storageKey = 'bone-consult-reminder-v1';
  const initialDelay = 8000;
  const secondDelay = 90000;
  const repeatDelay = 180000;
  let state;
  try { state = JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) { /* Storage can be unavailable. */ }
  if (!state || !Number.isFinite(state.nextAt) || ![0, 1, 2].includes(state.stage)) state = { stage: 0, nextAt: Date.now() + initialDelay };
  const save = () => { try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) { /* Keep working in memory. */ } };
  save();
  const dialog = document.createElement('dialog');
  dialog.className = 'consult-popup';
  dialog.setAttribute('aria-labelledby', 'consult-popup-title');
  dialog.setAttribute('aria-describedby', 'consult-popup-description');
  dialog.innerHTML = `<button type="button" class="consult-popup-close" aria-label="Close consultation reminder">×</button>
  <section class="popup-view popup-main" data-view="main">
    <div class="consult-popup-mark" aria-hidden="true"><svg class="pain-heart" viewBox="0 0 80 80"><defs><clipPath id="consult-heart-clip"><path d="M40 68 13.5 43C-1 29.3 8 9.5 23.8 10.5c7.3.5 12.3 4.5 16.2 9.6 3.9-5.1 8.9-9.1 16.2-9.6C72 9.5 81 29.3 66.5 43Z"/></clipPath></defs><path class="heart-base" d="M40 68 13.5 43C-1 29.3 8 9.5 23.8 10.5c7.3.5 12.3 4.5 16.2 9.6 3.9-5.1 8.9-9.1 16.2-9.6C72 9.5 81 29.3 66.5 43Z"/><g clip-path="url(#consult-heart-clip)"><path class="heart-liquid" d="M-8 22 Q2 16 12 22 T32 22 T52 22 T72 22 T92 22 V90 H-8Z"/></g><path class="heart-outline" d="M40 68 13.5 43C-1 29.3 8 9.5 23.8 10.5c7.3.5 12.3 4.5 16.2 9.6 3.9-5.1 8.9-9.1 16.2-9.6C72 9.5 81 29.3 66.5 43Z"/><path class="heart-pulse" d="M14 38h15l4-8 7 17 6-13 3 4h17"/></svg></div>
    <p class="popup-eyebrow">YOUR NEXT STEP TO FEELING BETTER</p>
    <h2 id="consult-popup-title">Still in Pain?</h2>
    <p id="consult-popup-description" class="consult-popup-description">Let’s find a way forward. Book a consultation for care centred around you.</p>
    <a class="consult-popup-book" href="index.html#consultation"><svg class="consult-popup-bone" viewBox="0 0 64 32" aria-hidden="true"><path class="bone-left" d="M30 9.5H17.2C14.5 9.5 13.7 4 9 4 4.6 4 3.4 8.5 5.9 11.2c-4.2 1.5-4.1 7.8.1 9.2C3.5 23.2 5 28 9.2 28c4.6 0 5.2-5.5 8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z"/><path class="bone-right" d="M30 9.5h16.8c2.7 0 3.5-5.5 8.2-5.5 4.4 0 5.6 4.5 3.1 7.2 4.2 1.5 4.1 7.8-.1 9.2 2.5 2.8 1 7.6-3.2 7.6-4.6 0-5.2-5.5-8-5.5H30l3-3.2-2.8-3.2 2.8-3.3Z"/><path class="bone-glint" d="M32 2v3M32 27v3M24 5l2 3M40 5l-2 3"/></svg><span>Book Consultation Now</span><span class="popup-arrow" aria-hidden="true">↗</span></a>
    <p class="popup-discover">EXPLORE MORE</p>
    <div class="consult-popup-links">
      <button type="button" data-open-view="instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7"/></svg><span>Instagram</span></button>
      <button type="button" data-open-view="cases"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M8 10h8M8 14h8M8 18h5"/></svg><span>Case Studies</span></button>
      <button type="button" data-open-view="testimonials"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.3-4.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="m12 6.5 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4Z"/></svg><span>Patient Testimonials</span></button>
    </div>
    <p class="consult-popup-contact">Need help? <a href="contact-us.html#schedule">Contact the clinic</a> or <a href="tel:+919669766111">call +91 96697 66111</a>.</p>
  </section>
  <section class="popup-view popup-detail" data-view="instagram" hidden><button type="button" class="popup-back" data-back>← Back</button><div class="popup-detail-icon instagram-icon" aria-hidden="true">◎</div><p class="popup-eyebrow">CONNECT WITH US</p><h2 id="popup-instagram-title" tabindex="-1">Follow our journey</h2><p>Explore clinic updates, movement tips and more from Bone and Beyondd.</p><div class="popup-profile"><img src="mark.webp" alt=""><div><strong>Bone and Beyondd</strong><span>@bone_and_beyondd</span></div></div><a class="popup-detail-primary" href="https://www.instagram.com/bone_and_beyondd?cplk=dDZvcjQ1NGszb21z" target="_blank" rel="noopener noreferrer">Open Instagram ↗</a><a class="popup-detail-secondary" href="blog.html">Explore our video journal and articles →</a></section>
  <section class="popup-view popup-detail" data-view="cases" hidden><button type="button" class="popup-back" data-back>← Back</button><div class="popup-detail-icon" aria-hidden="true">✚</div><p class="popup-eyebrow">LEARN ABOUT YOUR CARE</p><h2 id="popup-cases-title" tabindex="-1">Case Studies</h2><p>Patient case studies are not available on this site yet. Explore these care guides while you learn about treatment options.</p><div class="popup-guide-list"><a href="robotic-knee-replacement-guide.html"><span>Robotic knee replacement</span><span aria-hidden="true">→</span></a><a href="sports-injury-acl-guide.html"><span>Sports injury &amp; ACL care</span><span aria-hidden="true">→</span></a><a href="non-surgical-joint-pain-care.html"><span>Non-surgical joint pain care</span><span aria-hidden="true">→</span></a></div><a class="popup-detail-secondary" href="blog.html">Browse all care articles →</a></section>
  <section class="popup-view popup-detail" data-view="testimonials" hidden><button type="button" class="popup-back" data-back>← Back</button><div class="popup-detail-icon review-icon" aria-hidden="true">★</div><p class="popup-eyebrow">PATIENT EXPERIENCES</p><h2 id="popup-testimonials-title" tabindex="-1">Patient Testimonials</h2><p>Read patient feedback about Bone and Beyondd on the clinic’s Google listing.</p><div class="popup-review-card"><span aria-hidden="true">“</span><div><strong>Every experience matters</strong><p>See patient reviews and share your own experience on Google.</p></div></div><a class="popup-detail-primary" href="https://www.google.com/search?q=dr+anuj+patwari#lrd=0x3bcb99d8c05c929f:0x811a3ac9284ec640,1,,,," target="_blank" rel="noopener noreferrer">View patient reviews ↗</a><a class="popup-detail-secondary" href="index.html#patient-experience">Learn about our patient experience →</a></section>`;
  document.body.append(dialog);
  let currentView = 'main';
  const showView = (name, restoreFocus = true) => {
    const next = dialog.querySelector(`[data-view="${name}"]`);
    if (!next) return;
    const previous = currentView;
    dialog.querySelectorAll('.popup-view').forEach(view => { view.hidden = view !== next; });
    currentView = name;
    dialog.setAttribute('aria-labelledby', name === 'main' ? 'consult-popup-title' : `popup-${name}-title`);
    if (name === 'main') dialog.setAttribute('aria-describedby', 'consult-popup-description'); else dialog.removeAttribute('aria-describedby');
    dialog.scrollTop = 0;
    if (restoreFocus && dialog.open) (name === 'main' ? dialog.querySelector(`[data-open-view="${previous}"]`) : next.querySelector('h2'))?.focus();
  };
  dialog.querySelectorAll('[data-open-view]').forEach(button => button.addEventListener('click', () => showView(button.dataset.openView)));
  dialog.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showView('main')));
  let timer;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(check, Math.max(0, state.nextAt - Date.now())); };
  const check = () => {
    if (Date.now() < state.nextAt) return schedule();
    if (dialog.open || document.hidden || document.querySelector('dialog[open]') || document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')) { timer = setTimeout(check, 3000); return; }
    if (typeof dialog.showModal !== 'function') return;
    showView('main', false);
    try { dialog.showModal(); } catch (_) { timer = setTimeout(check, 3000); return; }
    state.stage = Math.min(2, state.stage + 1);
    state.nextAt = Date.now() + (state.stage === 1 ? secondDelay : repeatDelay);
    save();
    schedule();
  };
  dialog.querySelector('.consult-popup-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (Date.now() >= state.nextAt) { state.nextAt = Date.now() + repeatDelay; save(); } schedule(); });
  dialog.querySelector('.consult-popup-book').addEventListener('click', (event) => {
    const target = document.querySelector('#consultation');
    if (target) { event.preventDefault(); dialog.close(); target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); target.querySelector('input')?.focus({ preventScroll:true }); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
  schedule();
})();
