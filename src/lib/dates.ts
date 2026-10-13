const THURSDAY = 4;
const SATURDAY = 6;
const GAME_DAYS = [THURSDAY, SATURDAY];

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

export const today = () => toDateKey(new Date());

const EXPIRY_HOUR = 12;

// Games can run past midnight, so tables are kept until noon the next day.
export const expiryOf = (dateKey: string) => {
  const day = fromDateKey(dateKey);
  day.setDate(day.getDate() + 1);
  day.setHours(EXPIRY_HOUR);
  return day;
};
