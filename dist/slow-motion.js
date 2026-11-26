/* Slow, smooth motion across the site (paired with slow-motion.css).
   - sections fade and rise in as they scroll into view
   - images fade in from a soft blur once loaded and visible
   - buttons get a slow, soft press effect
   - pages fade out before moving to another page
   Content is never left hidden: if anything here fails, everything is shown. */
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Page fade-out when going to another page on this site
  const leaveTo = (url) => {
    root.classList.add('sm-leaving');
    setTimeout(() => { window.location.href = url; }, 450);
  };
  window.addEventListener('pageshow', () => root.classList.remove('sm-leaving'));
  if (!reduce) {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target && link.target !== '_self' || link.hasAttribute('download') || link.hasAttribute('data-lightbox')) return;
      let url;
      try { url = new URL(link.getAttribute('href'), window.location.href); } catch (e) { return; }
      if (url.origin !== window.location.origin) return;
      if (!/(\.html|\/)$/i.test(url.pathname)) return;
      const samePage = url.pathname === window.location.pathname ||
        (/\/(index\.html)?$/i.test(url.pathname) && /\/(index\.html)?$/i.test(window.location.pathname));
      if (samePage) return; // in-page jumps scroll as normal
      event.preventDefault();
      leaveTo(url.href);
    });
  }

  if (reduce || !('IntersectionObserver' in window)) return;

  const revealAll = () => {
    document.querySelectorAll('.sm-wait').forEach((el) => el.classList.remove('sm-wait'));
    document.querySelectorAll('img.sm-img-wait').forEach((img) => img.classList.remove('sm-img-wait'));
    document.querySelectorAll('.sm-book-wait').forEach((el) => el.classList.remove('sm-book-wait'));
  };

  try {
    root.classList.add('sm-ready');

    // ---- Sections ----
    const blocks = document.querySelectorAll('main > section, main > div:not(.wrap), main > .wrap > *, .exp-band, .site-footer');
    const holdsPinned = (el) => Array.prototype.some.call(el.querySelectorAll('*'), (child) => {
      const p = getComputedStyle(child).position;
      return p === 'fixed' || p === 'sticky';
    });
    const sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        sectionIO.unobserve(el);
        const cls = el.dataset.smFade ? 'sm-in-fade' : 'sm-in';
        el.classList.remove('sm-wait');
        el.classList.add(cls);
        el.addEventListener('animationend', function done(e) {
          if (e.target !== el) return;
          el.classList.remove(cls);
          el.removeEventListener('animationend', done);
        });
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    blocks.forEach((el) => {
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return; // hidden elements
      if (holdsPinned(el)) el.dataset.smFade = '1'; // no movement where something is pinned inside
      el.classList.add('sm-wait');
      sectionIO.observe(el);
    });

    // ---- Images ----
    const seen = new WeakSet();
    const skipImg = (img) => img.closest('.header, #navigation, .contact-strip, .bb-chat-launch, .bb-chat-panel, [class*="lightbox"], .side-rail, .insurance-logos, [class*="marquee"]') ||
      (img.getAttribute('width') && +img.getAttribute('width') < 48);
    const showImg = (img) => {
      if (!img.classList.contains('sm-img-wait')) return;
      requestAnimationFrame(() => {
        img.classList.remove('sm-img-wait');
        img.classList.add('sm-img-in');
        img.addEventListener('animationend', function done() {
          img.classList.remove('sm-img-in');
          img.removeEventListener('animationend', done);
        });
      });
    };
    const imgIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        imgIO.unobserve(img);
        if (img.complete) { showImg(img); return; }
        img.addEventListener('load', () => showImg(img), { once: true });
        img.addEventListener('error', () => showImg(img), { once: true });
        setTimeout(() => showImg(img), 6000); // never leave an image hidden
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0 });
    const prepImg = (img) => {
      if (seen.has(img) || skipImg(img)) return;
      seen.add(img);
      img.classList.remove('sm-img-in');
      img.classList.add('sm-img-wait');
      imgIO.observe(img);
    };
    document.querySelectorAll('img').forEach(prepImg);
    // Images added later (sliders, galleries, copied logos) get the same treatment
    new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') prepImg(node);
        else node.querySelectorAll && node.querySelectorAll('img').forEach(prepImg);
      }));
    }).observe(document.body, { childList: true, subtree: true });

    // ---- Book Consultation buttons: slow arrival when they come into view ----
    const bookIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        bookIO.unobserve(el);
        el.classList.remove('sm-book-wait');
        el.classList.add('sm-book-in');
        el.addEventListener('animationend', function done(e) {
          if (e.target !== el || e.animationName !== 'sm-book') return;
          el.classList.remove('sm-book-in');
          el.removeEventListener('animationend', done);
        });
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    document.querySelectorAll('a[href*="#consultation"]').forEach((el) => {
      if (el.closest('#navigation') || !/book/i.test(el.textContent)) return;
      el.classList.add('sm-book-wait');
      bookIO.observe(el);
    });

    // ---- Buttons: slow, soft press ----
    const pressable = '.button, .nav-cta, .drawer-book, .drawer-quick a, .bone-action, .care-secondary, .menu, .drawer-close, .exp-band-link, form button, .consult-panel button, .footer-contact';
    document.addEventListener('pointerdown', (event) => {
      const btn = event.target.closest(pressable);
      if (!btn) return;
      btn.classList.remove('sm-press');
      void btn.offsetWidth; // restart the animation on repeated taps
      btn.classList.add('sm-press');
    });
    document.addEventListener('animationend', (event) => {
      if (event.animationName === 'sm-press') event.target.classList.remove('sm-press');
    });
  } catch (err) {
    revealAll();
  }
})();
