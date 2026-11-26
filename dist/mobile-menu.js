/* Mobile / tablet slide-in menu drawer.
   Works alongside app.js and about.js, which toggle the `open` class on #navigation.
   This file adds the drawer header, close button, quick actions, backdrop,
   scroll lock and focus handling. */
(function () {
  const menu = document.querySelector('.nav .menu');
  const nav = document.getElementById('navigation');
  if (!menu || !nav || nav.dataset.drawerReady) return;
  nav.dataset.drawerReady = 'true';

  const root = document.documentElement;
  const drawerMode = matchMedia('(max-width: 1099px)');
  const logo = document.querySelector('.nav .logo img');
  const cta = document.querySelector('.nav .nav-cta');
  const bookHref = (cta && cta.getAttribute('href')) || 'index.html#consultation';

  nav.setAttribute('aria-label', 'Main navigation');

  // Drawer header: logo + close button
  const head = document.createElement('div');
  head.className = 'drawer-head';
  head.innerHTML =
    (logo ? '<a class="drawer-logo" href="index.html" aria-label="Bone and Beyondd home"><img src="' + logo.getAttribute('src') + '" alt="" width="150" height="45"></a>' : '<span></span>') +
    '<button type="button" class="drawer-close" aria-label="Close menu">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  nav.prepend(head);

  // Quick actions at the bottom of the drawer
  const actions = document.createElement('div');
  actions.className = 'drawer-actions';
  actions.innerHTML =
    '<a class="drawer-book" href="' + bookHref + '">Book Consultation</a>' +
    '<div class="drawer-quick">' +
    '<a href="tel:+919669766111"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72l.46 2.79a2 2 0 0 1-.57 1.77L9.71 10.3a16 16 0 0 0 4 4l1.01-1.01a2 2 0 0 1 1.77-.57l2.79.46A2 2 0 0 1 22 16.92Z"/></svg>Call</a>' +
    '<a href="https://wa.me/919669766111" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.42-4.72A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M9 8.4c.3-.3.6-.2.8.2l.7 1.4c.1.3 0 .5-.3.8l-.4.4a7 7 0 0 0 3 3l.4-.5c.2-.2.5-.3.8-.2l1.4.7c.4.2.5.5.2.8-.5.7-1.3 1-2.1.7-2.8-.8-5-3-5.8-5.8-.2-.7.2-1.3 1.3-1.5Z"/></svg>WhatsApp</a>' +
    '</div>' +
    '<p class="drawer-note">Esamia Bazar, Hyderabad</p>';
  nav.append(actions);

  // Dimmed backdrop behind the drawer
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.append(backdrop);

  const isOpen = () => nav.classList.contains('open');
  const requestClose = () => { if (isOpen()) menu.click(); };

  head.querySelector('.drawer-close').addEventListener('click', requestClose);
  backdrop.addEventListener('click', requestClose);

  // Keep page state in sync with the open class set by app.js / about.js
  let wasOpen = false;
  const sync = () => {
    const open = isOpen() && drawerMode.matches;
    root.classList.toggle('nav-open', open);
    menu.setAttribute('aria-label', isOpen() ? 'Close menu' : 'Open menu');
    if (open && !wasOpen) {
      nav.scrollTop = 0;
      setTimeout(() => head.querySelector('.drawer-close').focus({ preventScroll: true }), 60);
    } else if (!open && wasOpen) {
      nav.querySelectorAll('details[open]').forEach((d) => { d.open = false; });
      if (nav.contains(document.activeElement) || document.activeElement === document.body) menu.focus({ preventScroll: true });
    }
    wasOpen = open;
  };
  new MutationObserver(sync).observe(nav, { attributes: true, attributeFilter: ['class'] });
  drawerMode.addEventListener('change', () => {
    if (!drawerMode.matches && isOpen()) requestClose();
    sync();
  });

  // Keep keyboard focus inside the open drawer
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !root.classList.contains('nav-open')) return;
    const items = Array.from(nav.querySelectorAll('a[href], button, summary')).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  sync();
  // Only animate the drawer after the first paint, so it never slides
  // across the screen while the page is loading.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('drawer-ready')));
})();
