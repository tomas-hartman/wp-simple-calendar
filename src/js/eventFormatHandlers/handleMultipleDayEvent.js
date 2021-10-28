import { createEventForList } from './getFormatedEventsDataHelpers';

/**
 * 2. vícedenní akce @todo vícedenní opakované akce!
 * dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
 */
export const handleMultipleDayEvent = (eventPool, rawData, eventMeta) => {
  const { eventStartDate, eventEndDate, daysLen } = eventMeta;

  for (let i = 0; i < daysLen; i++) {
    const eventDate = new Date(eventStartDate);
    eventDate.setDate(eventDate.getDate() + i);

    eventPool.push(createEventForList(rawData, eventDate, eventEndDate));
  }
};
