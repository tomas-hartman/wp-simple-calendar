import { createEventForList } from './getFormatedEventsDataHelpers';

/**
 * dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
 */
export const handleMultipleDayListEvent = (eventPool, rawData, eventMeta) => {
  const { eventStartDate, eventEndDate, today } = eventMeta;

  if (eventEndDate < today) return;

  // případ kdy akce končí po dnešku, ale začíná někdy dříve - i ty potřebuju použít
  if (eventStartDate < today && eventEndDate >= today) {
    eventPool.push(createEventForList(rawData, eventStartDate, eventEndDate));
    return;
  }
  // standardní případ, kdy akce začíná v budoucnosti
  eventPool.push(createEventForList(rawData, eventStartDate, eventEndDate));
};
