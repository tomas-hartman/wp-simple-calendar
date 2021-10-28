import getMonthMeta from './getMonthMeta';
import { getWeeksWithEvents } from './getWeeksWithEvents';
import getWeeks from './getWeeks';

export const getCalendarData = (monthOffset, eventsData) => {
  const monthMeta = getMonthMeta(monthOffset);
  const { numOfDays, firstDayOfMonth } = monthMeta;
  const weeksMeta = getWeeks(numOfDays, firstDayOfMonth);

  return {
    ...monthMeta,
    days: getWeeksWithEvents(firstDayOfMonth, weeksMeta, eventsData),
  };
};
