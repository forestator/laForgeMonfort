import { useSyncExternalStore } from 'react';
import type { Player } from './types';

const STORAGE_KEY = 'soirees-jeux.player';

const loadPlayer = (): Player | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Player) : null;
  } catch {
    return null;
  }
};

// Module-level store so a rename in the settings reaches every component using the player.
let currentPlayer = loadPlayer();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const register = (name: string): Player => {
  currentPlayer = { id: currentPlayer?.id ?? crypto.randomUUID(), name };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlayer));
  } catch {
    // Storage can be blocked; joining still works for this session.
  }
  listeners.forEach((listener) => listener());
  return currentPlayer;
};

export const usePlayer = () => {
  const player = useSyncExternalStore(subscribe, () => currentPlayer);
  return { player, register };
};
