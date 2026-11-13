const introScreen = document.querySelector('#intro-screen');
const introSprite = document.querySelector('#intro-sprite');
const nextIntroSprite = document.querySelector('#intro-sprite-next');
const introReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (introReducedMotion.matches || !document.documentElement.classList.contains("has-intro")) {
  introScreen.remove();
} else {
  const frameDuration = 65;
  const introDuration = frameDuration * 16;
  const introStart = performance.now();

  function placeSprite(element, frame) {
    element.style.backgroundPosition = `${(frame % 4) * (100 / 3)}% ${Math.floor(frame / 4) * 100}%`;
  }

  function animateIntro(now) {
    const elapsed = now - introStart;
    if (elapsed >= introDuration) {
      introScreen.classList.add('show-logo');
      setTimeout(() => {
        introScreen.classList.add('is-finished');
        setTimeout(() => introScreen.remove(), 250);
      }, 220);
      return;
    }
    const frameIndex = Math.floor(elapsed / frameDuration);
    placeSprite(introSprite, frameIndex % 8);
    placeSprite(nextIntroSprite, (frameIndex + 1) % 8);
    nextIntroSprite.style.opacity = (elapsed % frameDuration) / frameDuration;
    requestAnimationFrame(animateIntro);
  }

  requestAnimationFrame(animateIntro);
}

const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
const mobile = matchMedia('(max-width: 850px)');

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menu.hidden = false;
menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
mobile.addEventListener('change', closeMenu);
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    closeMenu();
    navigation.querySelector('details').open = false;
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const dropdown = navigation.querySelector('details[open]');
  if (dropdown) {
    dropdown.open = false;
    dropdown.querySelector('summary').focus();
  } else if (navigation.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
document.querySelector('#date').min = localDate.toISOString().slice(0, 10);
// Pointer users can explore services without a separate click on desktop.
const servicesDropdown = navigation.querySelector('.dropdown');
servicesDropdown.addEventListener('pointerenter', (event) => {
  if (!mobile.matches && event.pointerType === 'mouse') servicesDropdown.open = true;
});
const videoStyles = document.createElement('link');
videoStyles.rel = 'stylesheet';
videoStyles.href = 'video-gallery.css?v=1';
document.head.appendChild(videoStyles);
const videoScript = document.createElement('script');
videoScript.src = 'video-gallery.js?v=1';
document.head.appendChild(videoScript);
servicesDropdown.addEventListener('pointerleave', (event) => {
  if (!mobile.matches && event.pointerType === 'mouse') servicesDropdown.open = false;
});
servicesDropdown.querySelector('summary').addEventListener('click', (event) => {
  if (!mobile.matches && event.detail > 0 && servicesDropdown.open) {
    event.preventDefault();
  }
});
