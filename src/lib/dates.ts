const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const GAME_DAYS = [THURSDAY, FRIDAY, SATURDAY];
const DAYS_PER_WEEK = 7;

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateKey = (dateKey: string) =>
  new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(
    fromDateKey(dateKey),
  );

export const upcomingGameDays = (count: number) => {
  const days: string[] = [];
  const cursor = new Date();
  while (days.length < count) {
    if (GAME_DAYS.includes(cursor.getDay())) {
      days.push(toDateKey(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

export const isRoleplayDay = (dateKey: string) => fromDateKey(dateKey).getDay() === FRIDAY;

// The start date plus the following weeks, e.g. every Friday for a recurring table.
export const weeklyDates = (startKey: string, weeks: number) =>
  Array.from({ length: weeks }, (_, index) => {
    const day = fromDateKey(startKey);
    day.setDate(day.getDate() + index * DAYS_PER_WEEK);
    return toDateKey(day);
  });

export const today = () => toDateKey(new Date());

const EXPIRY_HOUR = 12;

// Games can run past midnight, so tables are kept until noon the next day.
export const expiryOf = (dateKey: string) => {
  const day = fromDateKey(dateKey);
  day.setDate(day.getDate() + 1);
  day.setHours(EXPIRY_HOUR);
  return day;
};
