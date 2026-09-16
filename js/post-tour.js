(() => {
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
