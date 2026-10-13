import { useEffect, useState } from 'react';
import { today } from './dates';

const MIDNIGHT_MARGIN_MS = 1000;

// Keeps the app correct when it stays open past midnight.
export const useToday = () => {
  const [current, setCurrent] = useState(today);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = setTimeout(
      () => setCurrent(today()),
      midnight.getTime() - now.getTime() + MIDNIGHT_MARGIN_MS,
    );
    return () => clearTimeout(timer);
  }, [current]);

  return current;
};
