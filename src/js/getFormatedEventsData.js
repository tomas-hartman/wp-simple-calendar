import { getEventMeta } from './eventFormatHandlers/getEventMeta';
import { handleMultipleDayEvent } from './eventFormatHandlers/handleMultipleDayEvent';
import { handleOneOffEvent } from './eventFormatHandlers/handleOneOffEvent';
import { handleRepeatingEvent } from './eventFormatHandlers/handleRepeatingEvent';

/**
 *
 * @param {array} events výsledek XHR requestu
 * @param {number} size počet dní, pro které chci akci vykreslit ->
 * tolikrát se maximálně může za sebou událost zobrazit
 */
export const getFormatedEventsData = (events, size) => {
  /** @todo what do do with these? */
  const today = new Date();
  const todayNorm = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const upcomingEvents = [];

  /**
   * Pole s akcemi
   */
  for (let i = 0; i < events.length; i++) {
    // PHASE 1: GETTING DATA READY //

    const eventMeta = getEventMeta(events[i], today, todayNorm);
    const { repeatMode, daysLen, eventIsExpired } = eventMeta;

    // PHASE 2: PREPARING upcomingEvents //

    /** 1. obyč nadcházející jednorázové akce */
    if (repeatMode === 0 && daysLen === 1) {
      handleOneOffEvent(upcomingEvents, events[i], eventIsExpired);
      continue;
    }

    /** 2. vícedenní akce */
    if (repeatMode === 0 && daysLen > 1) {
      handleMultipleDayEvent(upcomingEvents, events[i], eventMeta);
      continue;
    }

    /** 3. opakující se akce */
    if (repeatMode > 0) {
      handleRepeatingEvent(upcomingEvents, events[i], eventMeta, size);
      continue;
    }

    // FALLBACK IF NOTHING WORKS OUT WELL
    console.warn('Event non-standard or broken data:');
    console.warn(events[i]);
  }

  return upcomingEvents;
};

// console.log(getEventsData(sample, 7));
