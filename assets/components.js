/* Shared nav + footer, injected so pages stay consistent.
   Path-aware: pages in subfolders set  <body data-root="../">  or "../../".
   Uses innerHTML (no fetch) so it works over file:// too. */
(function () {
  var body = document.body;
  var page = body.getAttribute('data-page') || '';
  var R = body.getAttribute('data-root') || '';   // '', '../', '../../'

  function h(href){ return R + href; }

  var links = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'resources.html', label: 'Resources', key: 'resources' },
    { href: 'framework.html', label: 'The Framework', key: 'framework' },
    { href: 'models.html', label: 'Partnership Models', key: 'models' },
    { href: 'cases.html', label: 'Case Studies', key: 'cases' }
  ];

  var mainLinks = links.map(function (l) {
    return '<a href="' + h(l.href) + '"' + (l.key === page ? ' class="active"' : '') + '>' + l.label + '</a>';
  }).join('');

  // "Read" dropdown — direct PDF viewer, not HTML chapter pages
  var readActive = (page === 'read' || page === 'downloads') ? ' active' : '';
  var readMenu =
    '<div class="nav-dd">' +
      '<button class="nav-dd-btn' + readActive + '" id="readBtn">Read <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<div class="nav-dd-menu" id="readMenu">' +
        '<a href="' + h('read/viewer.html?doc=executive-summary.pdf') + '"><b>Executive Summary</b><span>Read the PDF</span></a>' +
        '<a href="' + h('read/viewer.html') + '"><b>Full Playbook</b><span>Open the PDF viewer</span></a>' +
        '<a href="' + h('cases.html') + '"><b>Case Studies</b><span>Four cases, in detail</span></a>' +
      '</div>' +
    '</div>';

  var companion = '<a href="' + h('companion.html') + '"' + (page === 'companion' ? ' class="active"' : '') + '>AI Companion</a>';

  var nav =
    '<div class="nav"><div class="wrap nav-inner">' +
      '<a class="brand" href="' + h('index.html') + '">' +
        '<img class="logo-mark" src="' + h('assets/brand/rf-logo.png') + '" alt="">' +
        '<span class="brand-copy"><span class="brand-name">Advancing Partnerships</span><small>The Playbook</small></span>' +
      '</a>' +
      '<nav class="nav-links" id="navLinks">' + mainLinks + readMenu + companion +
        '<a href="' + h('read/viewer.html') + '" class="btn btn-primary nav-cta">Read the Playbook</a>' +
      '</nav>' +
      '<button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '</div></div>';

  var footer =
    '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="brand"><img class="logo-mark" src="' + h('assets/brand/rf-logo.png') + '" alt=""><span class="brand-copy"><span class="brand-name">Advancing Partnerships</span><small>The Playbook</small></span></div>' +
          '<p>A practical guide for turning social-impact activity into deployable, investable, and repeatable partnership pathways across Sub-Saharan Africa.</p>' +
        '</div>' +
        '<div><h5>Quick links</h5><ul>' +
          '<li><a href="' + h('index.html') + '">Home</a></li>' +
          '<li><a href="' + h('resources.html') + '">Resources</a></li>' +
          '<li><a href="' + h('framework.html') + '">The Framework</a></li>' +
          '<li><a href="' + h('models.html') + '">Partnership Models</a></li>' +
          '<li><a href="' + h('cases.html') + '">Case Studies</a></li>' +
          '<li><a href="' + h('read/viewer.html') + '">Read</a></li>' +
          '<li><a href="' + h('companion.html') + '">AI Companion</a></li>' +
        '</ul></div>' +
        '<div><h5>Contact</h5><ul>' +
          '<li><a href="mailto:contact@example.com">contact@example.com</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bot">' +
        '<span>&copy; 2026 Haskè Conseil. All rights reserved.</span>' +
        '<span>Platform v1.0 &middot; Last updated September 2026</span>' +
      '</div>' +
    '</div></footer>';

  var navMount = document.getElementById('nav');
  var footMount = document.getElementById('footer');
  if (navMount) navMount.innerHTML = nav;
  if (footMount) footMount.innerHTML = footer;

  // Mobile menu
  var burger = document.getElementById('burger');
  var nl = document.getElementById('navLinks');
  if (burger && nl) {
    burger.addEventListener('click', function () { nl.classList.toggle('open'); });
    nl.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nl.classList.remove('open');
    });
  }

  // Dropdown
  var rb = document.getElementById('readBtn');
  var rm = document.getElementById('readMenu');
  if (rb && rm) {
    rb.addEventListener('click', function (e) {
      e.stopPropagation();
      rm.classList.toggle('open');
    });
    document.addEventListener('click', function () { rm.classList.remove('open'); });
  }
  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
