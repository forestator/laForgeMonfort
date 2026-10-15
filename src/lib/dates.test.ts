import { describe, expect, it } from 'vitest';
import {
  expiryOf,
  fromDateKey,
  isRoleplayDay,
  toDateKey,
  upcomingGameDays,
  weeklyDates,
} from './dates';

describe('dates', () => {
  it('round-trips a date key', () => {
    expect(toDateKey(fromDateKey('2026-10-08'))).toBe('2026-10-08');
  });

  it('proposes only thursdays, fridays and saturdays, in order', () => {
    const days = upcomingGameDays(6);
    expect(days).toHaveLength(6);
    for (const day of days) {
      expect([4, 5, 6]).toContain(fromDateKey(day).getDay());
    }
    expect([...days].sort()).toEqual(days);
  });

  it('repeats a date every week, across month ends', () => {
    expect(weeklyDates('2026-10-23', 3)).toEqual(['2026-10-23', '2026-10-30', '2026-11-06']);
    expect(isRoleplayDay('2026-10-23')).toBe(true);
    expect(isRoleplayDay('2026-10-24')).toBe(false);
  });

  it('expires a table at noon the day after the game night', () => {
    const expiry = expiryOf('2026-10-08');
    expect(toDateKey(expiry)).toBe('2026-10-09');
    expect(expiry.getHours()).toBe(12);
  });
});
