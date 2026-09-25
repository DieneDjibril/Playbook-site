/* Guided orientation (Home) — full-screen, one question per screen.
   An ORIENTATION mechanism, not a substitute for the Playbook/Toolkit diagnostic process.
   It never claims to identify "the binding constraint" and never maps results to a Partnership Model.
   Content + result logic: assets/orientation-questions.js (locked questionnaire).
   Results carry forward to the Framework page: main areas (?areas=…) and single-signal areas (?also=…). */
(function () {
  var OR = window.APB && window.APB.orientation;
  if (!OR) return;
  var SETS = OR.SETS;
  var root, state;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // "You said that A, that B, and that C." — keeps clauses that contain commas readable
  function joinClauses(list) {
    var l = list.filter(function (x, i) { return x && list.indexOf(x) === i; }).map(function (x) { return 'that ' + x; });
    if (l.length < 2) return l.join('');
    if (l.length === 2) return l[0] + ', and ' + l[1];
    return l.slice(0, -1).join(', ') + ', and ' + l[l.length - 1];
  }

  function build() {
    root = document.createElement('div');
    root.className = 'diag';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'diagTitle');
    root.innerHTML =
      '<div class="diag-top"><div class="wrap">' +
        '<div class="diag-who"><small>Guided orientation</small><b id="diagWho"></b></div>' +
        '<div class="diag-top-actions">' +
          '<a class="diag-skip" id="diagSkip" href="#">Skip<span class="sk-long"> to your pathway</span> <span class="sk-arw" aria-hidden="true">&rarr;</span></a>' +
          '<button type="button" class="diag-close" id="diagClose" aria-label="Close and return to the homepage">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>' +
      '</div><div class="diag-progress" aria-hidden="true"><span id="diagBar"></span></div></div>' +
      '<div class="diag-body"><div class="wrap" id="diagStage" aria-live="polite"></div></div>' +
      '<div class="diag-foot"><div class="wrap">An orientation to help you decide where to look first — not a diagnosis. The Playbook and Toolkit support the deeper diagnostic process.</div></div>';
    document.body.appendChild(root);
    root.querySelector('#diagClose').addEventListener('click', close);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') trapFocus(e);
    });
  }

  function trapFocus(e) {
    var f = root.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]');
    f = Array.prototype.filter.call(f, function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  var opener = null;
  function open(who) {
    if (!SETS[who]) return;
    if (!root) build();
    opener = document.activeElement;
    state = { who: who, i: 0, answers: [] };
    root.querySelector('#diagWho').textContent = SETS[who].label;
    root.querySelector('#diagSkip').setAttribute('href', SETS[who].href);
    root.classList.add('open');
    document.body.classList.add('diag-lock');
    root.scrollTop = 0;
    render();
  }
  function close() {
    root.classList.remove('open');
    document.body.classList.remove('diag-lock');
    if (opener && opener.focus) opener.focus();
  }

  function swap(html, after) {
    var stage = root.querySelector('#diagStage');
    stage.classList.toggle('is-result', html.indexOf('or-result') > -1);
    stage.innerHTML = '<div class="diag-screen' + (reduceMotion ? '' : ' enter') + '">' + html + '</div>';
    root.scrollTop = 0;
    if (after) after(stage);
    var h = stage.querySelector('#diagTitle');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function render() {
    var set = SETS[state.who], total = set.questions.length;
    var bar = root.querySelector('#diagBar');
    if (state.i >= total) { bar.style.width = '100%'; return renderResult(); }
    bar.style.width = (state.i / total * 100) + '%';
    var q = set.questions[state.i];
    var chosen = state.answers[state.i];
    var html =
      (state.i === 0 ? '<p class="diag-intro">Six short questions about your situation. There are no right answers — choose <em>Not sure</em> whenever it fits.</p>' : '') +
      '<div class="diag-step">Question ' + (state.i + 1) + ' of ' + total + '</div>' +
      '<h2 class="diag-q" id="diagTitle">' + esc(q.text) + '</h2>' +
      (q.help ? '<p class="diag-help">' + esc(q.help) + '</p>' : '<div class="diag-help-gap"></div>') +
      '<div class="diag-opts" role="radiogroup" aria-labelledby="diagTitle">' +
        q.options.map(function (o, k) {
          var on = chosen === k;
          return '<button type="button" class="diag-opt' + (o.sig === 'NS' ? ' is-ns' : '') + '" role="radio" data-k="' + k + '" aria-checked="' + on + '" tabindex="' + ((chosen == null ? k === 0 : on) ? '0' : '-1') + '">' +
            '<span class="rad" aria-hidden="true"></span><span class="lbl">' + esc(o.label) + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="diag-nav">' +
        (state.i > 0 ? '<button type="button" class="btn btn-outline" id="diagBack"><span aria-hidden="true">&larr;</span> Back</button>' : '<span></span>') +
        '<button type="button" class="btn btn-accent" id="diagNext"' + (chosen == null ? ' disabled aria-disabled="true"' : '') + '>' +
          (state.i === total - 1 ? 'See your orientation' : 'Next') + ' <span class="arw" aria-hidden="true">&rarr;</span></button>' +
      '</div>';
    swap(html, function (stage) {
      var opts = Array.prototype.slice.call(stage.querySelectorAll('.diag-opt'));
      var next = stage.querySelector('#diagNext');
      function pick(b) {
        state.answers[state.i] = +b.getAttribute('data-k');
        opts.forEach(function (x) { var on = x === b; x.setAttribute('aria-checked', on); x.setAttribute('tabindex', on ? '0' : '-1'); });
        next.disabled = false; next.removeAttribute('aria-disabled');
      }
      opts.forEach(function (b, idx) {
        b.addEventListener('click', function () { pick(b); });
        b.addEventListener('keydown', function (e) {
          var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var n = opts[(idx + d + opts.length) % opts.length];
          n.focus(); pick(n);
        });
      });
      next.addEventListener('click', function () { if (state.answers[state.i] == null) return; state.i++; render(); });
      var back = stage.querySelector('#diagBack');
      if (back) back.addEventListener('click', function () { state.i--; render(); });
    });
  }

  function renderResult() {
    var set = SETS[state.who];
    var r = OR.evaluate(state.who, state.answers);
    var main = window.APB.setAreas(r.main);
    var secondary = window.APB.setSecondary(r.secondary);
    var q = [];
    if (main.length) q.push('areas=' + window.APB.areasParam(main));
    if (secondary.length) q.push('also=' + window.APB.areasParam(secondary));
    var fwHref = 'framework.html' + (q.length ? '?' + q.join('&') : '') + '#hypothesis';

    var head = main.length
      ? '<h2 id="diagTitle">Your responses suggest these areas may warrant further investigation.</h2>' +
        '<p class="or-lead">These are Indicative Challenge Areas — starting points for investigation, not identified binding constraints. More than one can be relevant, and none is ranked above another.</p>'
      : '<h2 id="diagTitle">No single area stands out from your responses.</h2>' +
        '<p class="or-lead">That is a legitimate outcome — it often means the picture is still forming. The Framework lets you explore the five Indicative Challenge Areas and pick what sounds closest.</p>';

    var cards = main.length ? '<div class="or-cards">' + main.map(function (k) {
      var a = window.APB.areaByKey[k];
      return '<article class="or-card">' +
        '<h3>' + esc(a.label) + '</h3>' +
        '<p class="or-about">' + esc(a.about) + '</p>' +
        '<div class="or-why"><span>Why this area</span><p>You said ' + esc(joinClauses(r.why[k])) + '.</p></div>' +
      '</article>';
    }).join('') + '</div>' : '';

    var sub = '';
    if (secondary.length) {
      var names = window.APB.listLabels(secondary);
      sub += '<p class="or-secondary">' + (secondary.length === 1
        ? 'One of your answers ' + (main.length ? 'also ' : '') + 'related to ' + esc(names) + '. It may be worth keeping in view.'
        : 'Some of your answers ' + (main.length ? 'also ' : '') + 'related to ' + esc(names) + '. They may be worth keeping in view.') + '</p>';
    }
    var notes = [];
    if (r.gapNote) {
      notes.push(r.manyNotSure ? 'Several of your answers were “Not sure”. Filling those gaps is often a useful first step.'
        : (r.gapRoles.payer && r.gapRoles.demand) ? 'You weren’t sure who pays or how clearly demand can be seen. Clarifying that is often a useful first step.'
        : r.gapRoles.payer ? 'You weren’t sure who pays or how payment would work. Clarifying that is often a useful first step.'
        : 'You weren’t sure how clearly demand can be seen or sized. Clarifying that is often a useful first step.');
    }
    if (r.communityNote) notes.push('You weren’t sure how communities or intended users see this work. Finding out early is often worthwhile — it is something to explore, not a sign of a problem.');
    if (notes.length) sub += '<div class="or-notes">' + notes.map(function (n) { return '<p class="or-note">' + esc(n) + '</p>'; }).join('') + '</div>';

    var html =
      '<div class="or-result">' +
        '<div class="diag-step">Your orientation · ' + esc(set.label) + '</div>' +
        head + cards +
        (sub ? '<div class="or-sub">' + sub + '</div>' : '') +
        '<section class="or-next" aria-labelledby="orNextT">' +
          '<h3 id="orNextT">Investigate further</h3>' +
          '<p>' + (main.length
            ? 'The Framework explains what each area may indicate and what to look into. The Toolkit helps you test the hypothesis before drawing any conclusion.'
            : 'Explore the five areas in the Framework, or use the Toolkit to look more closely at your situation.') + '</p>' +
          '<div class="or-actions">' +
            '<a class="btn btn-accent" href="' + fwHref + '">' + (main.length ? 'Continue to the Framework' : 'Explore the Framework') + ' <span class="arw" aria-hidden="true">&rarr;</span></a>' +
            '<a class="btn btn-outline" href="resources.html#toolkit">Use the Toolkit to test your hypothesis</a>' +
          '</div>' +
          '<div class="or-links">' +
            '<a href="' + set.href + '">Go to your pathway <span aria-hidden="true">&rarr;</span></a>' +
            '<button type="button" id="orChange">Change my answers</button>' +
            '<button type="button" id="orRestart">Start again</button>' +
          '</div>' +
        '</section>' +
      '</div>';
    swap(html, function (stage) {
      stage.querySelector('#orChange').addEventListener('click', function () { state.i = set.questions.length - 1; render(); });
      stage.querySelector('#orRestart').addEventListener('click', function () { state.i = 0; state.answers = []; render(); });
    });
  }

  // "Start here" on the four stakeholder cards (progressive enhancement: without JS they link to the pathway page)
  document.querySelectorAll('[data-stake]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(a.getAttribute('data-stake'));
    });
  });
  window.APB.openOrientation = open;
})();
