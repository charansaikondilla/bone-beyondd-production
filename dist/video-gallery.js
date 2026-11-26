(function () {
  const videos = [
    { file: 'care-journey.mp4', title: 'A care journey built around you', tag: 'Patient care' },
    { file: 'patient-consultation.mp4', title: 'Start with a thoughtful consultation', tag: 'Consultation' },
    { file: 'sports-recovery.mp4', title: 'Support for active recovery', tag: 'Sports medicine' },
    { file: 'robotic-care.mp4', title: 'Precision supported by technology', tag: 'Robotic care' },
    { file: 'movement-tips.mp4', title: 'Small steps towards better movement', tag: 'Movement' },
    { file: 'clinic-team.mp4', title: 'Meet the team behind your care', tag: 'Our clinic' },
    { file: 'recovery-plan.mp4', title: 'A recovery plan made for you', tag: 'Recovery' }
  ];

  // Each clip downloads and plays only while its card is on screen.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData);
  const watcher = !still && 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const player = entry.target.querySelector('video');
      if (entry.isIntersecting) {
        if (!player.src) player.src = player.dataset.src;
        player.muted = true;
        player.play().catch(() => {});
      } else player.pause();
    });
  }, { threshold: 0.4 }) : null;

  function card(video) {
    const item = document.createElement('article');
    item.className = 'video-card';
    item.dataset.category = video.tag;
    item.innerHTML = '<video muted loop playsinline preload="none" poster="videos/preview/' + video.file.replace('.mp4', '.webp') + '" data-src="videos/preview/' + video.file + '" aria-label="' + video.title + '"></video><div class="video-card-overlay"><span>' + video.tag + '</span><strong>' + video.title + '</strong></div>';
    if (watcher) watcher.observe(item);
    return item;
  }

  function gallery() {
    const section = document.createElement('section');
    section.className = 'video-showcase video-showcase--blog';
    section.setAttribute('aria-labelledby', 'video-heading-blog');
    section.innerHTML = '<div class="wrap"><div class="video-showcase-heading"><div><p class="ref-label">VIDEO JOURNAL</p><h2 id="video-heading-blog">Watch, learn and keep moving.</h2></div><p>Short visual stories to complement our practical orthopaedic health articles.</p></div><div class="video-filters" role="group" aria-label="Filter video journal"><button class="video-filter is-active" type="button" data-filter="All">All videos</button><button class="video-filter" type="button" data-filter="Patient care">Patient care</button><button class="video-filter" type="button" data-filter="Consultation">Consultation</button><button class="video-filter" type="button" data-filter="Sports medicine">Sports medicine</button><button class="video-filter" type="button" data-filter="Robotic care">Robotic care</button><button class="video-filter" type="button" data-filter="Movement">Movement</button><button class="video-filter" type="button" data-filter="Our clinic">Our clinic</button><button class="video-filter" type="button" data-filter="Recovery">Recovery</button></div><div class="video-scroller" aria-label="Automatically scrolling clinic videos"><div class="video-track"></div></div><p class="video-scroll-hint">Videos scroll automatically <span aria-hidden="true">→</span></p></div>';
    const track = section.querySelector('.video-track');
    const filters = section.querySelectorAll('.video-filter');

    function build(filter) {
      if (watcher) watcher.disconnect();
      track.replaceChildren();
      const visible = filter === 'All' ? videos : videos.filter((video) => video.tag === filter);
      visible.concat(visible).forEach((video) => track.appendChild(card(video)));
      section.querySelector('.video-scroller').classList.toggle('is-single', visible.length < 2);
    }

    filters.forEach((button) => button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.toggle('is-active', item === button));
      build(button.dataset.filter);
    }));
    build('All');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => { track.style.animationPlayState = entries[entries.length - 1].isIntersecting ? '' : 'paused'; }).observe(section);
    }
    return section;
  }

  function init() {
    const blogBanner = document.querySelector('.blog-banner');
    if (blogBanner && !document.querySelector('.video-showcase')) blogBanner.insertAdjacentElement('afterend', gallery());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
