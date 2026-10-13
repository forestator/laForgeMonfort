import { describe, expect, it } from 'vitest';
import { parseTable } from './parseTable';

const valid = {
  date: '2026-10-08',
  gameName: 'Catan',
  hostId: 'host',
  hostName: 'Alice',
  maxPlayers: 4,
  players: [{ id: 'p1', name: 'Bob' }],
};

describe('parseTable', () => {
  it('accepts a valid document and defaults notes', () => {
    expect(parseTable('t1', valid)).toEqual({ ...valid, id: 't1', notes: '' });
  });

  it('rejects malformed documents', () => {
    expect(parseTable('t1', { ...valid, maxPlayers: '4' })).toBeNull();
    expect(parseTable('t1', { ...valid, players: [{ id: 1 }] })).toBeNull();
    expect(parseTable('t1', {})).toBeNull();
  });
});

describe('parseTable optional fields', () => {
  it('keeps a valid start time and https cover', () => {
    const parsed = parseTable('t1', {
      ...valid,
      startTime: '20:30',
      coverUrl: 'https://cf.geekdo-images.com/x.jpg',
    });
    expect(parsed?.startTime).toBe('20:30');
    expect(parsed?.coverUrl).toBe('https://cf.geekdo-images.com/x.jpg');
  });

  it('drops invalid start time and non-https cover', () => {
    const parsed = parseTable('t1', { ...valid, startTime: '25:99', coverUrl: 'http://x/y.jpg' });
    expect(parsed?.startTime).toBeUndefined();
    expect(parsed?.coverUrl).toBeUndefined();
  });
});
