import getMonthMeta from './getMonthMeta';
import { getWeeksWithEvents } from './getWeeksWithEvents';
import getWeeks from './getWeeks';

export const getCalendarData = (monthOffset, eventsData) => {
  const monthMeta = getMonthMeta(monthOffset);
  const { firstDayOfMonth } = monthMeta;
  const weeksMeta = getWeeks(monthMeta);

  return {
    ...monthMeta,
    days: getWeeksWithEvents(firstDayOfMonth, weeksMeta, eventsData),
  };
};
