import { createContext, useContext } from 'react';

export const ToastContext = createContext<((message: string) => void) | null>(null);

export const useToast = () => {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useToast must be used inside ToastProvider');
  return notify;
};
