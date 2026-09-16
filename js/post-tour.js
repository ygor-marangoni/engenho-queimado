(() => {
  const mapFrame = document.querySelector('.location-map iframe[data-map-src]');

  if (mapFrame) {
    let mapStarted = false;
    let mapObserver;

    const loadMap = () => {
      if (mapStarted) return;
      mapStarted = true;
      const mapSource = mapFrame.dataset.mapSrc;
      mapFrame.removeAttribute('srcdoc');
      mapFrame.src = mapSource;
      mapFrame.removeAttribute('data-map-src');
      mapObserver?.disconnect();
    };

    const scheduleMap = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadMap, { timeout: 1800 });
      } else {
        window.setTimeout(loadMap, 650);
      }
    };

    if (document.readyState === 'complete') scheduleMap();
    else window.addEventListener('load', scheduleMap, { once: true });

    if ('IntersectionObserver' in window) {
      mapObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) loadMap();
      }, { rootMargin: '1200px 0px', threshold: 0 });
      mapObserver.observe(mapFrame.closest('.location-map'));
    }

    document.querySelector('a[href="#localizacao"]')?.addEventListener('click', loadMap, { once: true });
  }

  const revealConfig = [
    ['.project-overview-copy', 0],
    ['.project-stats', 110],
    ['.room-tour-media', 0, true],
    ['.room-tour-inner', 90],
    ['.location-intro', 0],
    ['.location-map', 80],
    ['.location-benefits__grid', 130],
    ['.pricing-intro', 0],
    ['.purchase-panel', 90],
    ['.pricing-cta', 140],
    ['.pricing-note', 180],
    ['.final-cta-content', 0],
    ['.final-cta-meta', 130]
  ];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const revealTargets = revealConfig.flatMap(([selector, delay, opacityOnly]) =>
    [...document.querySelectorAll(selector)].map(element => ({ element, delay, opacityOnly }))
  );

  revealTargets.forEach(({ element, delay, opacityOnly }) => {
    element.classList.add('section-fade');
    if (opacityOnly) element.classList.add('section-fade--opacity');
    element.style.setProperty('--section-fade-delay', `${delay}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  revealTargets.forEach(({ element }) => revealObserver.observe(element));
})();
