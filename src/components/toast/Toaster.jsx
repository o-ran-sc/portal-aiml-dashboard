import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { toastBus } from '../../utils/toast-bus';

export default function Toaster() {
  const [items, setItems] = useState([]);
  const MAX_TOASTS = 3;

  useEffect(() => {
    const handler = ({ msg, title, bg = 'dark', delay = 4000 }) => {
      const id = Date.now() + Math.random();
      setItems(prev => {
        const next = [...prev, { id, msg, title, bg, delay }];
        while (next.length > MAX_TOASTS) next.shift();
        return next;
      });
      if (delay > 0) {
        setTimeout(() => {
          setItems(prev => prev.filter(i => i.id !== id));
        }, delay);
      }
    };
    toastBus.on(handler);
    return () => toastBus.off(handler);
  }, []);

  return (
    <ToastContainer position='top-end' className='p-3'>
      {items.map(t => (
        <Toast key={t.id} bg={t.bg} onClose={() => setItems(prev => prev.filter(i => i.id !== t.id))} autohide={false}>
          {t.title ? (
            <Toast.Header>
              <strong className='me-auto'>{t.title}</strong>
            </Toast.Header>
          ) : null}
          <Toast.Body style={{ color: 'white' }}>
            {typeof t.msg === 'string' ? t.msg : JSON.stringify(t.msg)}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
