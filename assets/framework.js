/* Framework investigation tabs, with optional context carried forward from the Home orientation. */
(function () {
  var root = document.getElementById('inv');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.inv-tab'));
  var panels = Array.prototype.slice.call(root.querySelectorAll('.inv-panel'));
  var list = root.querySelector('.inv-tabs');
  var empty = document.getElementById('invEmpty');
  var APB = window.APB || null;

  var carried = APB ? APB.getAreas() : [];
  var also = APB && APB.getSecondary ? APB.getSecondary().filter(function (key) {
    return carried.indexOf(key) < 0;
  }) : [];
  var fromHome = carried.length > 0;

  root.classList.add('js-tabs');

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char];
    });
  }

  var carriedState = document.getElementById('invCarried');
  var coldState = document.getElementById('invCold');
  carriedState.hidden = !fromHome;
  coldState.hidden = fromHome;

  if (fromHome) {
    var note = document.getElementById('invCarriedNote');
    note.textContent = carried.length > 1
      ? 'Your responses suggest these areas may warrant further investigation. Neither is ranked above the other.'
      : 'Your responses suggest this area may warrant further investigation.';
    if (carried.length > 2) {
      note.textContent = 'Your responses suggest these areas may warrant further investigation. None is ranked above another.';
    }
  }

  if (also.length && APB) {
    var names = escapeHtml(APB.listLabels(also));
    var alsoNote = document.getElementById(fromHome ? 'invAlso' : 'invAlsoCold');
    alsoNote.hidden = false;
    alsoNote.innerHTML = fromHome
      ? (also.length === 1
        ? 'One of your answers also related to ' + names + '. It may be worth keeping in view.'
        : 'Some of your answers also related to ' + names + '. They may be worth keeping in view.')
      : 'Your orientation touched on ' + names + ' — you can explore ' + (also.length === 1 ? 'it' : 'them') + ' below.';
  }

  if (fromHome && list) {
    var yours = tabs.filter(function (tab) { return carried.indexOf(tab.dataset.k) > -1; });
    var others = tabs.filter(function (tab) { return carried.indexOf(tab.dataset.k) < 0; });
    yours.forEach(function (tab) {
      tab.classList.add('is-yours');
      list.appendChild(tab);
    });
    if (others.length) {
      var separator = document.createElement('span');
      separator.className = 'inv-tabs-sep';
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = 'Other areas';
      list.appendChild(separator);
      others.forEach(function (tab) { list.appendChild(tab); });
    }
    tabs = yours.concat(others);
  }

  function select(key, focus) {
    tabs.forEach(function (tab) {
      var selected = tab.dataset.k === key;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected || (!key && tab === tabs[0]) ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach(function (panel) {
      var selected = panel.dataset.k === key;
      panel.hidden = !selected;
      panel.classList.toggle('is-active', selected);
    });
    if (empty) empty.hidden = Boolean(key);
    root.classList.toggle('has-selection', Boolean(key));
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(tab.dataset.k); });
    tab.addEventListener('keydown', function (event) {
      var next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== null) {
        event.preventDefault();
        select(tabs[next].dataset.k, true);
      }
    });
  });

  select(fromHome ? carried[0] : null);

  if ((fromHome || also.length) && window.location.hash === '#hypothesis') {
    window.setTimeout(function () {
      var section = document.getElementById('hypothesis');
      if (section) section.scrollIntoView();
    }, 60);
  }
})();
