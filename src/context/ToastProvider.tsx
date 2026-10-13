import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from './ToastContext';

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const timer = useRef<number>(undefined);

  const notify = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(''), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      {/* The live region stays mounted so screen readers announce each new message. */}
      <div className="toast-region" role="status">
        {message && <p className="toast">{message}</p>}
      </div>
    </ToastContext.Provider>
  );
}
