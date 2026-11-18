(() => {
  'use strict';
  // Opens images linked with data-lightbox in a full-screen viewer.
  // Without <dialog> support the links simply open the image normally.
  const links = document.querySelectorAll('a[data-lightbox]');
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  dialog.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close image">&times;</button><img alt=""><p class="lightbox-caption"></p>';
  document.body.appendChild(dialog);
  if (typeof dialog.showModal !== 'function') { dialog.remove(); return; }

  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('.lightbox-caption');
  let opener = null;

  links.forEach(link => {
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const thumb = link.querySelector('img');
      opener = link;
      img.src = link.href;
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = link.dataset.caption || img.alt;
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    if (opener) opener.focus({preventScroll: true});
  });
})();
