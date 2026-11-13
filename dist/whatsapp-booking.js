(() => {
  'use strict';
  const number = '919669766111';
  const whatsappURL = (message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const openWhatsApp = (message) => { window.location.href = whatsappURL(message); };
  document.querySelectorAll('#appointment, .contact-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const clean = (key) => String(data.get(key) || '').trim();
      if (!clean('name') || !clean('phone')) {
        (form.querySelector('[role="status"]') || form).textContent = 'Please enter your name and phone number.';
        return;
      }
      const lines = ['Hello Bone and Beyondd, I would like to request a consultation.', '', `Name: ${clean('name')}`, `Phone: ${clean('phone')}`];
      if (clean('date')) lines.push(`Preferred date: ${clean('date')}`);
      if (clean('email')) lines.push(`Email: ${clean('email')}`);
      if (clean('message')) lines.push(`Message: ${clean('message')}`);
      lines.push('', 'Please let me know about availability.');
      openWhatsApp(lines.join('\n'));
    });
  });
  const style = document.createElement('style');
  style.textContent = `.floating-chat{display:none!important}.bb-chat-launch{position:fixed;right:20px;bottom:20px;z-index:999;background:#087e48;color:#fff;border:0;border-radius:999px;padding:13px 17px;display:flex;gap:9px;align-items:center;box-shadow:0 10px 30px #001c4160;font:700 14px system-ui;cursor:pointer}.bb-chat-launch svg{width:24px;height:24px}.bb-chat-panel{position:fixed;right:20px;bottom:82px;z-index:999;width:min(340px,calc(100vw - 32px));background:#fff;border:1px solid #dce8f4;border-radius:18px;box-shadow:0 20px 55px #071b3b35;overflow:hidden;font-family:system-ui,sans-serif;color:#0a2245}.bb-chat-panel[hidden]{display:none}.bb-chat-head{background:#092653;color:white;padding:18px 20px;display:flex;justify-content:space-between;align-items:start}.bb-chat-head strong{display:block;font-size:16px}.bb-chat-head small{color:#bcd6f3}.bb-chat-close{background:none;border:0;color:white;font-size:25px;cursor:pointer;line-height:1}.bb-chat-body{padding:18px}.bb-chat-body p{font-size:14px;line-height:1.5;margin:0 0 12px}.bb-chat-options{display:grid;gap:8px}.bb-chat-options button{background:#f1f7ff;border:1px solid #cfe3f8;border-radius:10px;padding:10px 12px;color:#123e77;text-align:left;font-weight:600;cursor:pointer}.bb-chat-options button:hover,.bb-chat-options button:focus-visible{background:#dfeeff}.bb-chat-note{font-size:12px!important;color:#50637b;margin:12px 0 0!important}@media(max-width:600px){.bb-chat-launch{right:14px;bottom:16px}.bb-chat-panel{right:16px;bottom:76px}}`;
  document.head.appendChild(style);
  const panel = document.createElement('section');
  panel.className = 'bb-chat-panel'; panel.hidden = true; panel.setAttribute('aria-label', 'WhatsApp clinic assistant');
  panel.innerHTML = `<div class="bb-chat-head"><div><strong>Bone and Beyondd</strong><small>How can we help?</small></div><button type="button" class="bb-chat-close" aria-label="Close chat">×</button></div><div class="bb-chat-body"><p>Choose a topic to start a conversation with our clinic on WhatsApp.</p><div class="bb-chat-options"><button type="button" data-msg="Hello, I would like to book a consultation with Dr. Anuj Patwari.">Book a consultation</button><button type="button" data-msg="Hello, could you please share the clinic timings and appointment availability?">Clinic timings &amp; availability</button><button type="button" data-msg="Hello, could you please share the clinic location and directions?">Location &amp; directions</button><button type="button" data-msg="Hello, I have a question for the Bone and Beyondd team.">Ask another question</button></div><p class="bb-chat-note">WhatsApp will open with a prepared message. Please send it to reach the clinic.</p></div>`;
  const launch = document.createElement('button'); launch.type = 'button'; launch.className = 'bb-chat-launch'; launch.setAttribute('aria-expanded', 'false'); launch.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.45L3 20.5l1.42-4.72A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8 8c.7 3 2.4 4.7 5.4 5.5"/></svg>Chat with us`;
  document.body.append(panel, launch);
  const toggle = (open) => { panel.hidden = !open; launch.setAttribute('aria-expanded', String(open)); if (open) panel.querySelector('.bb-chat-close').focus(); else launch.focus(); };
  launch.addEventListener('click', () => toggle(panel.hidden)); panel.querySelector('.bb-chat-close').addEventListener('click', () => toggle(false));
  panel.querySelectorAll('[data-msg]').forEach((button) => button.addEventListener('click', () => openWhatsApp(button.dataset.msg)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) toggle(false); });
})();
