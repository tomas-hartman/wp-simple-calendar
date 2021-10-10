import getMonthMeta from './getMonthMeta.mjs';
import getWeeks from './getWeeks.mjs';

export const getCalendarData = (monthOffset) => {
  const monthMeta = getMonthMeta(monthOffset);
  const { numOfDays, firstDayOfMonth } = monthMeta;

  return {
    ...monthMeta,
    days: getWeeks(numOfDays, firstDayOfMonth),
  };
};
