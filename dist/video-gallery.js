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

  function card(video) {
    const item = document.createElement('article');
    item.className = 'video-card';
    item.innerHTML = '<div class="video-frame"><video controls preload="metadata" playsinline src="videos/' + video.file + '" aria-label="' + video.title + '"></video></div>' +
      '<div class="video-card-copy"><span>' + video.tag + '</span><h3>' + video.title + '</h3><p>See how Bone and Beyondd keeps care clear, personal and focused on helping you move forward.</p></div>';
    return item;
  }

  function gallery(page, title, intro) {
    const section = document.createElement('section');
    section.className = 'video-showcase video-showcase--' + page;
    section.setAttribute('aria-labelledby', 'video-heading-' + page);
    section.innerHTML = '<div class="wrap"><div class="video-showcase-heading"><div><p class="ref-label">VIDEO JOURNAL</p><h2 id="video-heading-' + page + '">' + title + '</h2></div><p>' + intro + '</p></div><div class="video-scroller" tabindex="0" aria-label="Scroll through clinic videos"></div><p class="video-scroll-hint">Swipe or scroll sideways to see all videos <span aria-hidden="true">→</span></p></div>';
    const scroller = section.querySelector('.video-scroller');
    videos.forEach(function (video) { scroller.appendChild(card(video)); });
    return section;
  }

  function init() {
    const hero = document.querySelector('.reference-hero');
    if (hero) hero.insertAdjacentElement('afterend', gallery('home', 'See care in motion.', 'A closer look at the people, technology and recovery thinking behind Bone and Beyondd.'));
    const aboutBanner = document.querySelector('.about-banner');
    if (aboutBanner) aboutBanner.insertAdjacentElement('afterend', gallery('about', 'The people and moments behind our care.', 'Explore the clinic experience and the thoughtful approach that continues below the About section.'));
    const blogBanner = document.querySelector('.blog-banner');
    if (blogBanner) blogBanner.insertAdjacentElement('afterend', gallery('blog', 'Watch, learn and keep moving.', 'Short visual stories to complement our practical orthopaedic health articles.'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
