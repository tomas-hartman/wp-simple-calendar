import getMonthMeta from './getMonthMeta';
import { getWeeksWithEvents } from './getWeeksWithEvents';
import getWeeks from './getWeeks';
import { sample } from '../samples/data';
import { getEventsData } from './getFormatedEventsData';

export const getCalendarData = (monthOffset, eventsData) => {
  const monthMeta = getMonthMeta(monthOffset);
  const { numOfDays, firstDayOfMonth } = monthMeta;
  const weeksMeta = getWeeks(numOfDays, firstDayOfMonth);

  return {
    ...monthMeta,
    // days: getWeeks(numOfDays, firstDayOfMonth),
    days: getWeeksWithEvents(firstDayOfMonth, weeksMeta, eventsData),
  };
};

// console.log(getCalendarData(0));
