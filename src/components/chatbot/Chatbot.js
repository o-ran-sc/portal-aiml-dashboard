import React, { useEffect, useRef, useState } from 'react';
import './chatbot.css';

const container = (open) => ({
  position: 'fixed',
  right: '24px',
  bottom: open ? '24px' : '16px',
  width: '520px',
  maxWidth: '94vw',
  height: 'min(72vh, 700px)',
  zIndex: 1030,
  transform: `translateY(${open ? '0' : '16px'}) scale(${open ? 1 : 0.98})`,
  opacity: open ? 1 : 0,
  transition: 'opacity 220ms ease, transform 220ms ease, bottom 220ms ease'
});

const panel = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '16px',
  borderRadius: '16px',
  boxShadow: '0 18px 60px rgba(0,0,0,0.20)'
};

const header = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const title = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  fontWeight: 700,
  fontSize: '16px'
};

const badge = {
  fontSize: '11px',
  color: '#64748b',
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  padding: '2px 6px',
  borderRadius: '999px'
};

const iconBtn = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  lineHeight: 0
};

const messagesWrap = {
  flex: 1,
  overflow: 'auto',
  padding: '8px',
  borderRadius: '12px'
};

const row = (self) => ({
  display: 'flex',
  justifyContent: self ? 'flex-end' : 'flex-start',
  marginBottom: '8px'
});

const bubble = (self) => ({
  maxWidth: '78%',
  padding: '10px 12px',
  borderRadius: self ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
  background: self ? 'linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%)' : '#ffffff',
  color: self ? '#ffffff' : '#0f172a',
  border: self ? 'none' : '1px solid #e2e8f0',
  boxShadow: self ? '0 10px 24px rgba(6,182,212,0.25)' : '0 8px 18px rgba(0,0,0,0.06)',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap'
});

const composer = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end',
  marginTop: '12px'
};

const ta = {
  flex: 1,
  minHeight: '60px',
  maxHeight: '160px',
  resize: 'vertical',
  padding: '10px 12px',
  borderRadius: '12px',
  outline: 'none',
  fontSize: '14px'
};

const primaryBtn = (hover) => ({
  border: 'none',
  background: 'linear-gradient(135deg,#4f46e5 0%,#06b6d4 100%)',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: hover ? '0 12px 30px rgba(79,70,229,0.36)' : '0 10px 26px rgba(79,70,229,0.28)',
  transition: 'box-shadow 180ms ease, transform 180ms ease',
  transform: hover ? 'translateY(-1px)' : 'translateY(0)'
});

const hint = {
  fontSize: '12px',
  color: '#94a3b8',
  marginTop: '4px'
};

const fab = (hover) => ({
  position: 'fixed', right: '24px', bottom: '24px',
  width: '76px', height: '76px', borderRadius: '50%',
  border: 'none', cursor: 'pointer', zIndex: 1030,
  color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: 'none',
  transform: hover ? 'translateY(-1px) scale(1.06)' : 'translateY(0) scale(1)',
  transition: 'box-shadow 180ms ease, transform 180ms ease'
});

export function ChatbotToggle() {
  const [theme, setTheme] = useState(() => (typeof document !== 'undefined' ? (document.body.getAttribute('data-bs-theme') || 'light') : 'light'));
  const [open, setOpen] = useState(false);
  const [hoverSend, setHoverSend] = useState(false);
  const [hoverFab, setHoverFab] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  function pushMessage(role, content) {
    setMessages((prev) => [...prev, { id: prev.length + 1, role, content }]);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function onSend(e) {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    const userText = text.trim();
    setText('');
    pushMessage('user', userText);
    pushMessage('assistant', 'LLM endpoint is not connected.');
  }

  useEffect(() => {
    const body = document.body;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-bs-theme') {
          setTheme(body.getAttribute('data-bs-theme') || 'light');
        }
      }
    });
    observer.observe(body, { attributes: true });
    const onStorage = (e) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const isDark = theme === 'dark';

  const textColor = isDark ? '#f8fafc' : '#0f172a';

  return (
    <>
      {open && (
        <div style={container(open)} className='chatbot-container'>
          <div style={{ ...panel, color: textColor }} className='chatbot-panel'>
            <div style={header} className='chatbot-header'>
              <div style={title} className='chatbot-title'>
                <span>Assistant</span>
              </div>
              <button style={iconBtn} aria-label='Close' onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div style={{ ...messagesWrap }} className='chatbot-messages'>
              {messages.map((m) => (
                <div key={m.id} style={row(m.role === 'user')} className={`chatbot-row ${m.role}`}>
                  <div style={bubble(m.role === 'user')} className={`chatbot-bubble ${m.role}`}>{m.content}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div style={composer} className='chatbot-composer'>
              <textarea
                style={{ ...ta, color: textColor }}
                className='chatbot-textarea'
                placeholder='Type your message...'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button
                type='button'
                onClick={onSend}
                onMouseEnter={() => setHoverSend(true)}
                onMouseLeave={() => setHoverSend(false)}
                style={primaryBtn(hoverSend)}
              >
                Send
              </button>
            </div>
            <div style={hint} className='chatbot-hint'>Press Enter to send, Shift+Enter for a new line</div>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label='Open Chatbot'
          style={fab(hoverFab)}
          className='chatbot-fab'
          onMouseEnter={() => setHoverFab(true)}
          onMouseLeave={() => setHoverFab(false)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
          </svg>
        </button>
      )}
    </>
  );
}

