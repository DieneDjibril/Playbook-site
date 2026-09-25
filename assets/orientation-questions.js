/* Guided orientation — LOCKED QUESTIONNAIRE (validated against the four case studies + hypothetical scenarios).
   Four stakeholder sets × 6 questions. One answer per question.

   Signals per option:  2 = clear signal (++)   1 = supporting signal (+)   'NS' = "Not sure" (no signal)
   Area keys:  D Demand & Visibility · P Payment Credibility & Risk · R Preparation & Readiness
               C Coordination & Fragmentation · L Legitimacy & Trust

   Boundary rule (keep when editing):
     nobody can see or size the demand                              → D (Demand & Visibility)
     demand is visible, but no credible commitment to buy or pay     → P (Payment Credibility & Risk)

   `echo` = the clause used in the "Why this area" sentence ("You said …").
   `role` marks the payer / demand / community questions used for the information-gap notes.
   `wh`   marks the "what happens" question (what counterparties actually raise). */
(function () {
  var NS = 'NS';
  function o(label, sig, echo) { return { label: label, sig: sig || {}, echo: echo || '' }; }
  function ns(label) { return { label: label || 'Not sure', sig: NS }; }

  var SETS = {
    development: {
      label: 'Development & Delivery Actors',
      href: 'pathways/development.html',
      questions: [
        { id: 'd1', role: 'payer', text: 'Who pays for the work you deliver, on an ongoing basis?',
          help: 'This is about who pays for the service or activity itself — not who funds your growth.',
          options: [
            o('Mainly donors or grants', { P: 2 }, 'your work is mainly paid for by donors or grants'),
            o('A government body, buyer or company is interested, but nothing is agreed or budgeted', { P: 2 }, 'a potential payer is interested, but nothing is agreed or budgeted'),
            o('There is an agreed payer, but payments are often late or uncertain', { P: 2 }, 'payments from the agreed payer are often late or uncertain'),
            o('There is an agreed payer — the people we serve, a public body or a buyer — and payments are reliable', {}),
            ns()
          ] },
        { id: 'd2', role: 'demand', text: 'How clearly can you show the demand for what you do?',
          options: [
            o('We have solid data on who needs it, how many people and where', {}),
            o('We know the need is real, but mostly from our own experience and stories', { D: 2 }, 'the need is known mostly from your own experience and stories'),
            o('Demand is spread across many small groups or locations that are hard to present as one picture', { D: 1, C: 1 }, 'demand is spread across many small groups or locations'),
            ns()
          ] },
        { id: 'd3', wh: true, text: 'When you discuss scaling with potential partners, funders or investors, what do they most often come back with?',
          help: 'Choose the one you hear most often.',
          options: [
            o('They like the impact, but ask for figures we don’t have — users, volumes, costs', { D: 2 }, 'partners ask for figures you don’t have yet'),
            o('They ask who will pay, or worry about getting paid', { P: 2 }, 'partners ask who will pay, or worry about getting paid'),
            o('They ask for studies, plans or documents we haven’t prepared', { R: 2 }, 'partners ask for studies or plans you haven’t prepared yet'),
            o('They’re interested, but nobody seems sure who should take the next step', { C: 2 }, 'partners are interested, but nobody seems sure who should take the next step'),
            o('They question whether communities would take it up or trust a new partner', { L: 2 }, 'partners question whether communities would take it up or trust a new partner'),
            ns('We haven’t had these conversations yet / Not sure')
          ] },
        { id: 'd4', text: 'If a serious partner asked tomorrow for a clear expansion plan — costs, how it would run, timeline — how ready would you be?',
          options: [
            o('We could share one quickly', {}),
            o('We have parts of it, but costs or operating needs aren’t fully worked out', { R: 2 }, 'costs or operating needs for expansion aren’t fully worked out'),
            o('We would need outside help to prepare it', { R: 2 }, 'you would need outside help to prepare an expansion plan'),
            o('It would depend heavily on one grant, one person or one relationship', { R: 1, L: 1 }, 'expansion would depend heavily on one grant, person or relationship'),
            ns()
          ] },
        { id: 'd5', text: 'Thinking about others active in this area — government, NGOs, businesses, funders — which fits best?',
          options: [
            o('Roles are clear and someone is actively driving things forward', {}),
            o('Many are active, but efforts run in parallel and don’t add up', { C: 2 }, 'many organisations are active, but their efforts run in parallel'),
            o('Key decisions or approvals sit with institutions we can’t easily reach', { C: 2 }, 'key decisions or approvals sit with institutions you can’t easily reach'),
            o('We work largely on our own', { C: 1 }, 'you work largely on your own'),
            ns()
          ] },
        { id: 'd6', role: 'community', text: 'How are the communities you serve involved in shaping and checking the work?',
          options: [
            o('They help shape it and have clear ways to raise concerns, which we act on', {}),
            o('We consult them, mostly after key decisions are made', { L: 2 }, 'communities are consulted mostly after key decisions are made'),
            o('Uptake or trust has been lower than expected in some places', { L: 2 }, 'uptake or trust has been lower than expected in some places'),
            o('Uptake is strong, but it relies heavily on our own staff and relationships', { L: 1 }, 'uptake relies heavily on your own staff and relationships'),
            ns()
          ] }
      ]
    },

    funders: {
      label: 'Funders & Capital Providers',
      href: 'pathways/funders.html',
      questions: [
        { id: 'f1', wh: true, text: 'When you consider supporting an initiative at larger scale, what most often holds the decision back?',
          help: 'Choose the one that comes up most often.',
          options: [
            o('It’s hard to judge how big the opportunity is, or which organisations to back', { D: 2 }, 'it’s hard to judge how big the opportunity is, or whom to back'),
            o('It’s unclear how it will be paid for once our funding ends', { P: 2 }, 'it’s unclear how the work will be paid for once your funding ends'),
            o('Proposals aren’t developed enough — feasibility, costing or structure are missing', { R: 2 }, 'proposals often lack feasibility, costing or structure'),
            o('Too many actors are involved and no one clearly leads', { C: 2 }, 'too many actors are involved and no one clearly leads'),
            o('There are doubts about local ownership, or whether people will use it', { L: 2 }, 'there are doubts about local ownership or whether people will use it'),
            ns()
          ] },
        { id: 'f2', role: 'payer', text: 'When your funding or purchasing support ends, what is expected to happen?',
          options: [
            o('Another funder, government, buyer or investor has committed to take over', {}),
            o('We hope others will step in, but nothing is agreed', { P: 2 }, 'you hope others will step in when your support ends, but nothing is agreed'),
            o('The activity would likely shrink or stop', { P: 2 }, 'the activity would likely shrink or stop without your support'),
            o('Local institutions are expected to own and run it, but their capacity isn’t yet clear', { L: 1, R: 1 }, 'local institutions are expected to take over, but their capacity isn’t yet clear'),
            ns()
          ] },
        { id: 'f3', text: 'In the opportunities you fund, where does most of the risk sit today?',
          options: [
            o('With small organisations or local implementers, without real buffers', { P: 2 }, 'most of the risk sits with small organisations or local implementers without buffers'),
            o('Companies or investors would only enter if someone covers the payment or policy risk', { P: 2 }, 'companies or investors would only enter if someone covers the risk'),
            o('The main risks haven’t been clearly identified yet', { R: 2 }, 'the main risks haven’t been clearly identified yet'),
            o('Risks are identified and reasonably shared', {}),
            ns()
          ] },
        { id: 'f4', text: 'How would you describe the flow of opportunities you see?',
          options: [
            o('Plenty of priorities and ideas, but few ready to fund', { R: 2 }, 'there are plenty of ideas, but few are ready to fund'),
            o('Many good initiatives, but each too small to justify a significant commitment', { D: 1, C: 2 }, 'many good initiatives are each too small to justify a significant commitment'),
            o('We rarely see opportunities until they’re already well developed', { D: 2 }, 'you rarely see opportunities until they’re already well developed'),
            o('Capable organisations exist, but they can’t yet meet the required quality or technical standards', { R: 2, C: 1 }, 'capable organisations can’t yet meet the required quality or technical standards'),
            o('A steady flow of fundable opportunities', {}),
            ns()
          ] },
        { id: 'f5', text: 'How does your support connect with other funders and public bodies in this area?',
          options: [
            o('We co-fund with clear roles and a shared plan', {}),
            o('Several funders are active, but support is fragmented or duplicated', { C: 2 }, 'support from several funders is fragmented or duplicated'),
            o('Progress depends on government decisions that are slow or unpredictable', { C: 2, P: 1 }, 'progress depends on slow or unpredictable government decisions'),
            o('We largely act on our own', { C: 1 }, 'you largely act on your own'),
            ns()
          ] },
        { id: 'f6', role: 'community', text: 'How do you know whether the people meant to benefit actually want, trust and use what you fund?',
          options: [
            o('Regular, independent feedback and uptake data that shape our decisions', {}),
            o('Mainly through grantee reports', { L: 1 }, 'you rely mainly on grantee reports to know whether people want and use the work'),
            o('Uptake has been slower than planned in some places', { L: 2, D: 1 }, 'uptake has been slower than planned in some places'),
            o('Local partners deliver the work but have little say in key decisions', { L: 2 }, 'local partners deliver the work but have little say in key decisions'),
            ns()
          ] }
      ]
    },

    government: {
      label: 'Governments & Public Institutions',
      href: 'pathways/government.html',
      questions: [
        { id: 'g1', text: 'Think of a priority project or service you’d like private partners to help deliver. Where is it today?',
          options: [
            o('It’s a stated priority or on a project list, but hasn’t been studied in detail', { R: 2 }, 'the project is a stated priority but hasn’t been studied in detail'),
            o('Studies exist, but the structure, contracts or procurement route aren’t settled', { R: 2 }, 'the structure, contracts or procurement route aren’t settled'),
            o('It’s ready to procure, but partners haven’t come forward', { D: 1, P: 1 }, 'the project is ready to procure, but partners haven’t come forward'),
            o('A first phase is running, but expanding beyond it has stalled', { R: 1, C: 1 }, 'expanding beyond a first phase has stalled'),
            ns()
          ] },
        { id: 'g2', role: 'payer', text: 'How would the service be paid for over the long term?',
          options: [
            o('Through a dedicated multi-year budget line or contract', {}),
            o('It’s a policy commitment, but the budget isn’t yet secured', { P: 2 }, 'the service is a policy commitment without a secured budget'),
            o('A budget or public payer exists, but payments are often delayed or its ability to honour long-term obligations is questioned', { P: 2 }, 'payments are often delayed, or the public payer’s long-term obligations are questioned'),
            o('Through user fees or tariffs, but affordability is uncertain', { P: 1, L: 1 }, 'the service would rely on user fees or tariffs whose affordability is uncertain'),
            o('Mainly through development-partner funding', { P: 1 }, 'the service relies mainly on development-partner funding'),
            ns()
          ] },
        { id: 'g3', wh: true, text: 'When companies or investors have looked at this, what concerns have they raised?',
          help: 'Choose the concern raised most often.',
          options: [
            o('Whether payments will arrive on time, or whether rules may change', { P: 2 }, 'investors worry whether payments will arrive on time or rules may change'),
            o('Whether the project is prepared well enough to price and finance', { R: 2 }, 'investors question whether the project is prepared well enough to price and finance'),
            o('How many approvals are needed, and who decides', { C: 2 }, 'investors ask how many approvals are needed and who decides'),
            o('Whether demand or the market is large enough', { D: 2 }, 'investors question whether demand or the market is large enough'),
            o('Whether local communities will accept it', { L: 2 }, 'investors ask whether local communities will accept it'),
            ns('We haven’t engaged private partners yet / Not sure')
          ] },
        { id: 'g4', text: 'How many public institutions must agree for this to move forward, and is one clearly in charge?',
          options: [
            o('One institution leads, and approvals follow a clear sequence', {}),
            o('Several institutions are involved, with overlapping roles', { C: 2 }, 'several institutions are involved, with overlapping roles'),
            o('One leads, but others can delay or block decisions', { C: 2 }, 'other institutions can delay or block decisions'),
            o('It’s unclear who has the final say', { C: 2 }, 'it’s unclear who has the final say'),
            ns()
          ] },
        { id: 'g5', role: 'demand', text: 'How clear is your picture of demand — how many people, where, and at what cost?',
          options: [
            o('Clear, based on recent and reliable data', {}),
            o('Partial — the need is known, but figures on users, volumes or costs are incomplete', { D: 2 }, 'figures on users, volumes or costs are incomplete'),
            o('Demand is spread across many districts, providers or small users — hard to present as one opportunity', { D: 1, C: 1 }, 'demand is spread across many districts, providers or small users'),
            ns()
          ] },
        { id: 'g6', role: 'community', text: 'How are communities and local organisations involved?',
          options: [
            o('They’re consulted early, shape the design and have channels to raise concerns', {}),
            o('They’re consulted once plans are largely set', { L: 2 }, 'communities are consulted once plans are largely set'),
            o('Similar projects have faced local resistance, disputes or low uptake', { L: 2 }, 'similar projects have faced local resistance, disputes or low uptake'),
            o('Local organisations deliver services but have little say in how things are run', { L: 1 }, 'local organisations have little say in how things are run'),
            ns()
          ] }
      ]
    },

    investors: {
      label: 'Private Sector & Investors',
      href: 'pathways/investors.html',
      questions: [
        { id: 'p1', wh: true, text: 'Thinking of an opportunity in this space you’ve looked at or are part of, what has most held you back from committing more?',
          help: 'Choose the main reason.',
          options: [
            o('Hard to find deals of the right size, or to assess many small ones', { D: 2, C: 1 }, 'it’s hard to find deals of the right size or to assess many small ones'),
            o('Uncertainty about getting paid, or about risks outside our control (policy, currency)', { P: 2 }, 'you’re uncertain about getting paid, or about risks outside your control'),
            o('It isn’t structured enough to assess — missing data, contracts or studies', { R: 2 }, 'the opportunity isn’t structured enough to assess'),
            o('Too many parties involved and no one clearly accountable', { C: 2 }, 'too many parties are involved and no one is clearly accountable'),
            o('Concerns about reputation, community acceptance or social risk', { L: 2 }, 'you have concerns about reputation, community acceptance or social risk'),
            ns()
          ] },
        { id: 'p2', role: 'payer', text: 'How confident are you in the revenue or repayment source?',
          options: [
            o('A contracted payer with a reliable track record', {}),
            o('A payer is identified, but payments could be delayed or depend on public budgets', { P: 2 }, 'payments could be delayed or depend on public budgets'),
            o('A payer is identified, but how and when we’d be repaid isn’t worked out yet', { P: 2, R: 1 }, 'how and when you’d be repaid isn’t worked out yet'),
            o('It depends on many small customers whose ability to pay is uncertain', { P: 1, D: 1 }, 'revenue depends on many small customers whose ability to pay is uncertain'),
            o('There’s no clear payer yet — it’s mostly grant-funded', { P: 2 }, 'there’s no clear payer yet'),
            ns()
          ] },
        { id: 'p3', role: 'demand', text: 'Could you see the actual volume of business — orders, customers, borrowers or supply — before committing?',
          options: [
            o('Yes — firm orders, contracts or reliable data', {}),
            o('The need is visible, but no one has committed to buy or pay yet', { P: 2 }, 'the need is visible, but no one has committed to buy or pay yet'),
            o('It’s spread across many small buyers, borrowers or producers with no common channel', { D: 1, C: 2 }, 'business is spread across many small buyers, borrowers or producers'),
            o('We couldn’t see or size it with any confidence', { D: 2 }, 'you couldn’t see or size the volume of business with any confidence'),
            ns()
          ] },
        { id: 'p4', text: 'If you wanted to invest or expand next year, what would you need that isn’t there yet?',
          options: [
            o('Feasibility work, financial models or legal documentation', { R: 2 }, 'you’d need feasibility work, financial models or legal documentation'),
            o('Technical know-how or quality standards we don’t yet have', { R: 2 }, 'you’d need technical know-how or quality standards you don’t yet have'),
            o('Reliable local partners or suppliers that meet quality standards', { C: 2, R: 1 }, 'you’d need reliable local partners or suppliers that meet quality standards'),
            o('Someone accountable for the parts outside our control — permits, connections, approvals', { C: 2 }, 'you’d need someone accountable for the parts outside your control'),
            o('Nothing major — mainly finding the right opportunity', { D: 1 }, 'you’re mainly looking for the right opportunity'),
            ns()
          ] },
        { id: 'p5', text: 'How are the partners on the ground organised?',
          options: [
            o('A clear lead partner coordinates everyone', {}),
            o('Several partners each handle a piece, but no one steers', { C: 2 }, 'several partners each handle a piece, but no one steers'),
            o('It rests on one champion or one relationship', { R: 1, C: 1 }, 'it rests on one champion or one relationship'),
            ns()
          ] },
        { id: 'p6', role: 'community', text: 'How do users or local communities see the product, service or project?',
          options: [
            o('It’s well known and trusted locally', {}),
            o('It’s new to them — trust and uptake are still to be built', { L: 2, D: 1 }, 'trust and uptake among users are still to be built'),
            o('There have been complaints, resistance or concerns about affordability or fairness', { L: 2 }, 'there have been complaints, resistance or fairness concerns'),
            o('We haven’t looked closely at this yet', { L: 1 }, 'you haven’t yet looked closely at how users see it'),
            ns()
          ] }
      ]
    }
  };

  var AREA_KEYS = { D: 'demand-visibility', P: 'payment-credibility', R: 'preparation-readiness', C: 'coordination-fragmentation', L: 'legitimacy-trust' };
  var ORDER = ['D', 'P', 'R', 'C', 'L'];   // fixed taxonomy order — areas are never ranked

  /* Result logic (locked):
     • Main area      = at least two answers point to it, with at least one clear signal.
     • Secondary      = not a main area, and exactly one answer gives it a clear signal.
     • Supporting signals alone never create a main or secondary result.
     • "Not sure" gives no signal.
     • Community "Not sure"  → short exploration note.
     • 3+ "Not sure", or "Not sure" on the payer / demand question → short information-gap note. */
  function evaluate(setKey, answers) {
    var set = SETS[setKey]; if (!set) return null;
    var hits = {}; ORDER.forEach(function (a) { hits[a] = []; });
    var notSure = [], nsRoles = {};
    set.questions.forEach(function (q, i) {
      var k = answers[i]; if (k == null) return;
      var opt = q.options[k];
      if (opt.sig === NS) { notSure.push(q.id); if (q.role) nsRoles[q.role] = true; return; }
      Object.keys(opt.sig).forEach(function (a) { hits[a].push({ q: q.id, s: opt.sig[a], echo: opt.echo }); });
    });
    var main = [], secondary = [], why = {};
    ORDER.forEach(function (a) {
      var h = hits[a];
      var qs = {}; h.forEach(function (x) { qs[x.q] = 1; });
      var clear = h.some(function (x) { return x.s === 2; });
      if (clear && Object.keys(qs).length >= 2) {
        main.push(AREA_KEYS[a]);
        var ordered = h.filter(function (x) { return x.s === 2; }).concat(h.filter(function (x) { return x.s === 1; }));
        why[AREA_KEYS[a]] = ordered.map(function (x) { return x.echo; });
      } else if (clear) {
        secondary.push(AREA_KEYS[a]);
      }
    });
    return {
      main: main, secondary: secondary, why: why, notSure: notSure,
      communityNote: !!nsRoles.community,
      gapNote: notSure.length >= 3 || !!nsRoles.payer || !!nsRoles.demand,
      gapRoles: { payer: !!nsRoles.payer, demand: !!nsRoles.demand },
      manyNotSure: notSure.length >= 3
    };
  }

  window.APB = window.APB || {};
  window.APB.orientation = { SETS: SETS, evaluate: evaluate, AREA_KEYS: AREA_KEYS };
})();
