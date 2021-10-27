import { monthMeta } from '../samples/monthMeta.mjs';
import { sample } from '../samples/data.mjs';
import { getEventsData } from './prepareEvents.mjs';

// const eventsData = getEventsData(sample, 7);

// console.log(getWeeks(numOfDays, firstDayOfMonth));

/**
 * @todo This is completely wierd, but I want to make it work for now.
 */
export const getWeeksWithEvents = (firstDayOfMonth, weeksMeta, eventsData) => {
  const thisMonth = new Date(firstDayOfMonth);
  const year = thisMonth.getFullYear();
  const month = thisMonth.getMonth() + 1;

  const merged = weeksMeta.map((dayMeta) => {
    const monthMetaDateTime = new Date(`${year}-${month}-${dayMeta.date}`).getTime();

    const eventsOfTheDay = eventsData.filter((event) => {
      const eventDateTime = new Date(event.eventDate).getTime();

      return monthMetaDateTime === eventDateTime;
    });

    if (eventsOfTheDay.length >= 1) {
      return {
        ...dayMeta,
        events: eventsOfTheDay,
      };
    }

    return dayMeta;
  });

  console.log(merged);

  return merged;
};

// console.log(getMonthMetaWithEvents(monthMeta, eventsData));
