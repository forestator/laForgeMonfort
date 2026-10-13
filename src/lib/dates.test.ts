import { describe, expect, it } from 'vitest';
import { expiryOf, fromDateKey, toDateKey, upcomingGameDays } from './dates';

describe('dates', () => {
  it('round-trips a date key', () => {
    expect(toDateKey(fromDateKey('2026-10-08'))).toBe('2026-10-08');
  });

  it('proposes only thursdays and saturdays, in order', () => {
    const days = upcomingGameDays(6);
    expect(days).toHaveLength(6);
    for (const day of days) {
      expect([4, 6]).toContain(fromDateKey(day).getDay());
    }
    expect([...days].sort()).toEqual(days);
  });

  it('expires a table at noon the day after the game night', () => {
    const expiry = expiryOf('2026-10-08');
    expect(toDateKey(expiry)).toBe('2026-10-09');
    expect(expiry.getHours()).toBe(12);
  });
});
