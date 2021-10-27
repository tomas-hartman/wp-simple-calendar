import getMonthMeta from './getMonthMeta.mjs';
import { getWeeksWithEvents } from './getMonthMetaWithEvents.mjs';
import getWeeks from './getWeeks.mjs';
import { sample } from '../samples/data.mjs';
import { getEventsData } from './prepareEvents.mjs';

export const getCalendarData = (monthOffset) => {
  const monthMeta = getMonthMeta(monthOffset);
  const { numOfDays, firstDayOfMonth } = monthMeta;
  const weeksMeta = getWeeks(numOfDays, firstDayOfMonth);
  const eventsData = getEventsData(sample, 7);

  return {
    ...monthMeta,
    // days: getWeeks(numOfDays, firstDayOfMonth),
    days: getWeeksWithEvents(firstDayOfMonth, weeksMeta, eventsData),
  };
};

// console.log(getCalendarData(0));
