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

  var companion = '<a href="' + h('companion.html') + '" class="companion-nav-link' + (page === 'companion' ? ' active' : '') + '">AI Companion</a>';
  var networkMark = '<span class="network-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M24 24 10 10M24 24 38 10M24 24 10 38M24 24 38 38" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="24" r="6" fill="var(--green)" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="5" fill="var(--amber)"/><circle cx="38" cy="10" r="5" fill="var(--forest)"/><circle cx="10" cy="38" r="5" fill="var(--forest)"/><circle cx="38" cy="38" r="5" fill="var(--amber)"/></svg></span>';

  var nav =
    '<div class="nav"><div class="wrap nav-inner">' +
      '<a class="brand" href="' + h('index.html') + '">' +
        '<img class="logo-mark" src="' + h('assets/brand/rf-logo.png') + '" alt="">' +
        '<span class="brand-divider" aria-hidden="true"></span>' + networkMark +
        '<span class="brand-copy"><span class="brand-name">Advancing<br>Partnerships</span><small>Playbook</small></span>' +
      '</a>' +
      '<nav class="nav-links" id="navLinks">' + mainLinks + readMenu + companion + '</nav>' +
      '<button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '</div></div>';

  var footer =
    '<footer class="footer"><div class="wrap">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="footer-kicker">An initiative of</div>' +
          '<div class="brand"><img class="logo-mark" src="' + h('assets/brand/rf-logo.png') + '" alt=""><span class="brand-divider" aria-hidden="true"></span>' + networkMark + '<span class="brand-copy"><span class="brand-name">Advancing<br>Partnerships</span><small>Playbook</small></span></div>' +
          '<p>A practical guide for turning social-impact activity into deployable, investable, and repeatable partnership pathways across Sub-Saharan Africa.</p>' +
        '</div>' +
        '<div><h5>Explore</h5><ul>' +
          '<li><a href="' + h('index.html') + '">Home</a></li>' +
          '<li><a href="' + h('resources.html') + '">Resources</a></li>' +
          '<li><a href="' + h('framework.html') + '">The Framework</a></li>' +
          '<li><a href="' + h('models.html') + '">Partnership Models</a></li>' +
          '<li><a href="' + h('cases.html') + '">Case Studies</a></li>' +
          '<li><a href="' + h('read/viewer.html') + '">Read</a></li>' +
          '<li><a href="' + h('companion.html') + '">AI Companion</a></li>' +
        '</ul></div>' +
        '<div><h5>Read</h5><ul>' +
          '<li><a href="' + h('read/viewer.html?doc=executive-summary.pdf') + '">Executive Summary</a></li>' +
          '<li><a href="' + h('read/viewer.html') + '">Full Playbook</a></li>' +
          '<li><a href="' + h('downloads.html') + '">Downloads</a></li>' +
        '</ul></div>' +
        '<div><h5>Contact &amp; follow</h5><div class="footer-social">' +
          '<a href="https://www.rockefellerfoundation.org/" target="_blank" rel="noopener" aria-label="Rockefeller Foundation website">◎</a>' +
          '<a href="https://www.linkedin.com/company/rockefeller-foundation/" target="_blank" rel="noopener" aria-label="Rockefeller Foundation on LinkedIn">in</a>' +
          '<a href="mailto:contact@example.com" aria-label="Email">✉</a>' +
        '</div></div>' +
      '</div>' +
    '</div><div class="footer-bot"><div class="wrap">' +
      '<span>&copy; 2026 Haskè Conseil. All rights reserved.</span>' +
    '</div></div></footer>';

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
