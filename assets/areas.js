/* Indicative Challenge Areas — shared by the Home orientation and the Framework page.
   These are orientation-stage areas to investigate, never a finding of "the binding constraint".
   `about` = a neutral one-line description of what each area covers (not a finding). It preserves the
   boundary rule: cannot see or size demand → Demand & Visibility; demand visible but no credible
   commitment to buy or pay → Payment Credibility & Risk. */
(function () {
  var AREAS = [
    { key: 'demand-visibility',          label: 'Demand & Visibility',
      about: 'Whether the need or demand can be seen, evidenced and sized by those who might buy, fund or invest.' },
    { key: 'payment-credibility',        label: 'Payment Credibility & Risk',
      about: 'Whether visible demand is backed by a credible commitment to buy or pay — and whether risks sit with those able to carry them.' },
    { key: 'preparation-readiness',      label: 'Preparation & Readiness',
      about: 'Whether the opportunity is developed enough — studies, costings, standards, structure — for partners to assess and act on it.' },
    { key: 'coordination-fragmentation', label: 'Coordination & Fragmentation',
      about: 'Whether someone owns the process of moving things forward, and whether many small or separate efforts can add up.' },
    { key: 'legitimacy-trust',           label: 'Legitimacy & Trust',
      about: 'Whether the people and communities involved trust, accept and help shape the work — and can hold it to account.' }
  ];
  var STORE = 'apb.indicativeAreas';
  var STORE2 = 'apb.secondaryAreas';   // single-signal areas: kept in view, never presented as results
  var valid = {};
  AREAS.forEach(function (a) { valid[a.key] = a; });

  function clean(list) {
    var seen = {}, out = [];
    (list || []).forEach(function (k) { k = String(k).trim(); if (valid[k] && !seen[k]) { seen[k] = 1; out.push(k); } });
    // keep taxonomy order — areas are never ranked
    return AREAS.map(function (a) { return a.key; }).filter(function (k) { return seen[k]; });
  }
  function setAreas(keys) {
    var set = clean(keys);
    try { sessionStorage.setItem(STORE, JSON.stringify(set)); } catch (e) {}
    return set;
  }
  function getAreas() {
    try {
      var p = new URLSearchParams(window.location.search).get('areas');
      if (p) return clean(p.split(','));
    } catch (e) {}
    try { return clean(JSON.parse(sessionStorage.getItem(STORE) || '[]')); } catch (e) { return []; }
  }
  function toParam(keys) { return clean(keys).join(','); }
  function setSecondary(keys) {
    var set = clean(keys);
    try { sessionStorage.setItem(STORE2, JSON.stringify(set)); } catch (e) {}
    return set;
  }
  function getSecondary() {
    try {
      var sp = new URLSearchParams(window.location.search);
      if (sp.get('areas') !== null || sp.get('also') !== null) return clean((sp.get('also') || '').split(','));
    } catch (e) {}
    try { return clean(JSON.parse(sessionStorage.getItem(STORE2) || '[]')); } catch (e) { return []; }
  }
  function listLabels(keys) {
    var l = clean(keys).map(function (k) { return valid[k].label; });
    return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1];
  }

  window.APB = window.APB || {};
  window.APB.AREAS = AREAS;
  window.APB.areaByKey = valid;
  window.APB.setAreas = setAreas;
  window.APB.getAreas = getAreas;
  window.APB.areasParam = toParam;
  window.APB.setSecondary = setSecondary;
  window.APB.getSecondary = getSecondary;
  window.APB.listLabels = listLabels;
})();
