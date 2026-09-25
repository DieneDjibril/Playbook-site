/* ---------- Playbook Companion frontend ---------- */
var STARTERS = [
  'Where should I start?',
  'What is deployability?',
  'How do the three partnership models differ?',
  'Help me explore what may be holding my project back',
  'Explain the Impact Capital Continuum',
  'Show me a case that may be relevant to my situation'
];

var chatEl;
var inputEl;
var convo = [];
var isSending = false;
var BOT_AVATAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="4"></rect><path d="M12 3v4M9 13h.01M15 13h.01M9 17h6M2 12h2M20 12h2"></path><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"></circle></svg>';

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
  });
}

function highlightKeyTerms(html) {
  var container = document.createElement('div');
  container.innerHTML = html;
  var terms = [
    'Demand & visibility',
    'Payment credibility & risk',
    'Preparation & readiness',
    'Coordination & fragmentation',
    'Legitimacy & trust',
    'Aggregation & Warehouse Platforms',
    'Project Preparation & Guarantee Platform',
    'Predictable Delivery Networks'
  ];
  var pattern = new RegExp('(' + terms.map(function (term) {
    return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|') + ')', 'g');
  var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  var nodes = [];
  var node;
  while ((node = walker.nextNode())) {
    if (node.parentElement && !/^(A|CODE|PRE|SCRIPT|STYLE)$/i.test(node.parentElement.tagName)) {
      nodes.push(node);
    }
  }
  nodes.forEach(function (textNode) {
    if (!pattern.test(textNode.nodeValue)) {
      pattern.lastIndex = 0;
      return;
    }
    pattern.lastIndex = 0;
    var fragment = document.createDocumentFragment();
    var parts = textNode.nodeValue.split(pattern);
    parts.forEach(function (part, index) {
      if (!part) return;
      var isTerm = index % 2 === 1;
      if (isTerm) {
        var badge = document.createElement('span');
        badge.className = 'term-badge';
        badge.textContent = part;
        fragment.appendChild(badge);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    textNode.parentNode.replaceChild(fragment, textNode);
  });
  return container.innerHTML;
}

function renderMarkdown(text) {
  if (typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
    return '<p>' + escapeHtml(text).replace(/\r?\n/g, '<br>') + '</p>';
  }
  marked.setOptions({ breaks: true, gfm: true });
  var rendered = marked.parse(String(text));
  var sanitized = DOMPurify.sanitize(rendered, {
    USE_PROFILES: { html: true },
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i
  });
  return highlightKeyTerms(sanitized);
}

function addMsg(role, content, isHtml) {
  var message = document.createElement('div');
  message.className = 'msg ' + role;
  var body = isHtml ? content : escapeHtml(content);
  message.innerHTML = role === 'bot'
    ? '<div class="avatar">' + BOT_AVATAR + '</div><div class="bubble">' + body + '</div>'
    : '<div class="bubble">' + body + '</div>';
  chatEl.appendChild(message);
  chatEl.scrollTop = chatEl.scrollHeight;
  return message;
}

function typingIndicator() {
  var message = document.createElement('div');
  message.className = 'msg bot';
  message.innerHTML = '<div class="avatar">' + BOT_AVATAR + '</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
  chatEl.appendChild(message);
  chatEl.scrollTop = chatEl.scrollHeight;
  return message;
}

function setSending(sending) {
  isSending = sending;
  document.getElementById('sendBtn').disabled = sending;
  inputEl.disabled = sending;
}

async function send(text) {
  text = (text || inputEl.value).trim();
  if (!text || isSending) return;
  inputEl.value = '';
  addMsg('user', text, false);
  convo.push({ role: 'user', content: text });
  var typing = typingIndicator();
  setSending(true);
  try {
    var response = await fetch('/.netlify/functions/companion-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: convo })
    });
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error(data.error || 'The Companion is temporarily unavailable — try again in a moment.');
    }
    var replyHtml = renderMarkdown(data.reply);
    typing.remove();
    addMsg('bot', replyHtml, true);
    convo.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    typing.remove();
    addMsg('bot', 'The Companion is temporarily unavailable — try again in a moment.', false);
  } finally {
    setSending(false);
    inputEl.focus();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  chatEl = document.getElementById('chat');
  inputEl = document.getElementById('chatInput');
  if (!chatEl || !inputEl) return;

  addMsg('bot', 'Hello — I can help you explore the framework, think through what may be holding a project back, compare partnership models, and find relevant case evidence. What are you working on? <a href="framework.html">The Framework</a> · <a href="models.html">Partnership Models</a>', true);

  var starters = document.getElementById('starters');
  STARTERS.forEach(function (starter) {
    var button = document.createElement('button');
    button.className = 'starter';
    button.type = 'button';
    button.textContent = starter;
    button.addEventListener('click', function () { send(starter); });
    starters.appendChild(button);
  });

  document.getElementById('sendBtn').addEventListener('click', function () { send(); });
  inputEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  });

  try {
    var ask = new URLSearchParams(window.location.search).get('ask');
    if (ask) setTimeout(function () { send(ask); }, 450);
  } catch (error) {
    /* Ignore unsupported URLSearchParams implementations. */
  }
});
