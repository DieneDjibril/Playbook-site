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

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character];
  });
}

function renderMarkdown(text) {
  var plainText = String(text)
    .replace(/^[ \t]*(?:[-*+•]|\d+[.)])[ \t]+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|[^\w])(\*|_)([^*_\n]+)\2(?!\w)/gm, '$1$3')
    .replace(/^#{1,6}[ \t]+/gm, '');
  var safe = escapeHtml(plainText).replace(/\r?\n/g, '<br>');
  return safe.replace(/\[([^\]]+)\]\((framework\.html|models\.html|cases\.html|resources\.html)\)/g,
    '<a href="$2">$1</a>');
}

function addMsg(role, content, isHtml) {
  var message = document.createElement('div');
  message.className = 'msg ' + role;
  var body = isHtml ? content : escapeHtml(content);
  message.innerHTML = role === 'bot'
    ? '<div class="avatar">A</div><div class="bubble">' + body + '</div>'
    : '<div class="bubble">' + body + '</div>';
  chatEl.appendChild(message);
  chatEl.scrollTop = chatEl.scrollHeight;
  return message;
}

function renderLinks(links) {
  if (!Array.isArray(links) || !links.length) return '';
  return '<div class="msg-links">' + links.map(function (link) {
    if (!link || typeof link.label !== 'string' || typeof link.url !== 'string') return '';
    var allowed = ['framework.html', 'models.html', 'cases.html', 'resources.html'];
    if (allowed.indexOf(link.url) === -1) return '';
    return '<a href="' + link.url + '">' + escapeHtml(link.label) + ' &rarr;</a>';
  }).join('') + '</div>';
}

function typingIndicator() {
  var message = document.createElement('div');
  message.className = 'msg bot';
  message.innerHTML = '<div class="avatar">A</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
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
    var replyHtml = renderMarkdown(data.reply) + renderLinks(data.links);
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
