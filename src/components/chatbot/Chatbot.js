import React, { useEffect, useRef, useState } from 'react';
import './chatbot.css';

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
        <div className={`chatbot-container ${open ? 'open' : ''}`}>
          <div className='chatbot-panel'>
            <div className='chatbot-header'>
              <div className='chatbot-title'>
                <span>Assistant</span>
              </div>
              <button className='chatbot-icon' aria-label='Close' onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className='chatbot-messages'>
              {messages.map((m) => (
                <div key={m.id} className={`chatbot-row ${m.role}`}>
                  <div className={`chatbot-bubble ${m.role}`}>{m.content}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className='chatbot-composer'>
              <textarea
                className='chatbot-textarea'
                placeholder='Type your message...'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
              />
              <button type='button' onClick={onSend} className='chatbot-send'>
                Send
              </button>
            </div>
            <div className='chatbot-hint'>Press Enter to send, Shift+Enter for a new line</div>
          </div>
        </div>
      )}

      {!open && (
        <button onClick={() => setOpen(true)} aria-label='Open Chatbot' className='chatbot-fab'>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
          </svg>
        </button>
      )}
    </>
  );
}

