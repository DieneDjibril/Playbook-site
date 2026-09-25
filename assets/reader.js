/* Reader behaviours: progress bar, anchor links, mobile TOC, in-Playbook search.
   Search index is provided by playbook-search.js as window.PLAYBOOK_INDEX (works over file://). */
(function () {
  // ---- Reading progress ----
  var bar = document.getElementById('progressBar');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Hover anchor links on headings ----
  var content = document.querySelector('.reader-content');
  if (content) {
    content.querySelectorAll('h2, h3, h4').forEach(function (hd) {
      if (!hd.id) {
        hd.id = hd.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
      }
      var a = document.createElement('a');
      a.href = '#' + hd.id; a.className = 'anchor'; a.textContent = '#';
      a.setAttribute('aria-label', 'Link to this section');
      hd.appendChild(a);
    });
  }

  // ---- Wrap tables for horizontal scroll on mobile ----
  if (content) {
    content.querySelectorAll('table').forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains('table-wrap')) return;
      var w = document.createElement('div'); w.className = 'table-wrap';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }

  // ---- Mobile TOC toggle ----
  var toggle = document.getElementById('tocToggle');
  var toc = document.getElementById('toc');
  if (toggle && toc) {
    toggle.addEventListener('click', function () { toc.classList.toggle('open'); });
    toc.addEventListener('click', function (e) { if (e.target.tagName === 'A') toc.classList.remove('open'); });
  }

  // ---- In-Playbook search ----
  var input = document.getElementById('tocSearch');
  var results = document.getElementById('tocResults');
  var list = document.getElementById('tocList');
  var idx = window.PLAYBOOK_INDEX || null;
  if (input && results && list && idx) {
    var root = document.body.getAttribute('data-root') || '';
    function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
    function run(q) {
      q = q.trim();
      if (q.length < 2) { results.classList.remove('on'); list.style.display = ''; return; }
      list.style.display = 'none'; results.classList.add('on');
      var re = new RegExp(esc(q), 'i');
      var hits = [];
      idx.forEach(function (ch) {
        // match in title or body; collect a snippet
        var m = ch.text.search(re);
        if (ch.title.search(re) !== -1 || m !== -1) {
          var snippet = '';
          if (m !== -1) {
            var s = Math.max(0, m - 40);
            snippet = (s > 0 ? '…' : '') + ch.text.slice(s, m + q.length + 50).replace(re, function (x){return '<mark>'+x+'</mark>';}) + '…';
          }
          hits.push({ ch: ch, snippet: snippet });
        }
      });
      if (!hits.length) { results.innerHTML = '<div class="none">No matches in the Playbook.</div>'; return; }
      results.innerHTML = hits.slice(0, 12).map(function (hobj) {
        return '<a class="sr" href="' + root + hobj.ch.url + '"><b>' + hobj.ch.title + '</b>' + (hobj.snippet || '') + '</a>';
      }).join('');
    }
    input.addEventListener('input', function () { run(input.value); });
  }
})();
