const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const getDateLabel = (date: Date, now: Date) => {
  const todayStart = startOfDay(now);
  const yesterdayStart = addDays(todayStart, -1);
  const targetDayStart = startOfDay(date);

  if (targetDayStart.getTime() === todayStart.getTime()) return "Today";
  if (targetDayStart.getTime() === yesterdayStart.getTime()) return "Yesterday";

  return formatShortDate(date);
};

export { addDays, formatShortDate, getDateLabel, startOfDay };
