import type { DocumentData } from 'firebase/firestore';
import type { GameTable, Player } from './types';

const isPlayer = (value: Player) =>
  typeof value?.id === 'string' && typeof value?.name === 'string';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const optionalString = (value: string | undefined) =>
  typeof value === 'string' ? value : undefined;

// Firestore data is untrusted: drop documents that do not match the expected shape.
export const parseTable = (id: string, data: DocumentData): GameTable | null => {
  const {
    date,
    gameName,
    hostId,
    hostName,
    maxPlayers,
    notes,
    players,
    startTime,
    coverUrl,
    seriesId,
  } = data;
  const valid =
    typeof date === 'string' &&
    typeof gameName === 'string' &&
    typeof hostId === 'string' &&
    typeof hostName === 'string' &&
    typeof maxPlayers === 'number' &&
    Array.isArray(players) &&
    players.every(isPlayer);
  if (!valid) return null;
  return {
    id,
    date,
    gameName,
    hostId,
    hostName,
    maxPlayers,
    notes: notes ?? '',
    players,
    startTime: TIME_PATTERN.test(startTime ?? '') ? startTime : undefined,
    // Only https images are rendered, whatever is stored.
    coverUrl: optionalString(coverUrl)?.startsWith('https://') ? coverUrl : undefined,
    seriesId: optionalString(seriesId),
  };
};
