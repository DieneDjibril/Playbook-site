/* Play the Framework diagrams once when they enter the viewport. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var elements = Array.prototype.slice.call(document.querySelectorAll('.fw-orbit, [data-seq]'));
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });

  elements.forEach(function (element) {
    element.classList.add('is-armed');
    observer.observe(element);
  });
})();
