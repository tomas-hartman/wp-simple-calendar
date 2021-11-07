import { getEventMeta } from './eventFormatHandlers/getEventMeta';
import { handleMultipleDayEvent } from './eventFormatHandlers/handleMultipleDayEvent';
import { handleMultipleDayListEvent } from './eventFormatHandlers/handleMultipleDayListEvent';
import { handleOneOffEvent } from './eventFormatHandlers/handleOneOffEvent';
import { handleRepeatingEvent } from './eventFormatHandlers/handleRepeatingEvent';

/**
 *
 * @param {array} events výsledek XHR requestu
 * @param {number} size počet dní, pro které chci akci vykreslit ->
 * tolikrát se maximálně může za sebou událost zobrazit
 */
export const getFormatedEventsData = (events, size, forList = false) => {
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
      handleOneOffEvent(upcomingEvents, events[i], eventIsExpired, forList);
      continue;
    }

    /**
     * 2. vícedenní akce
     * Callbacks for calendar and list are different
     */
    if (repeatMode === 0 && daysLen > 1) {
      // For calendar:
      if (!forList) {
        handleMultipleDayEvent(upcomingEvents, events[i], eventMeta);
        continue;
      }

      // For event list:
      handleMultipleDayListEvent(upcomingEvents, events[i], eventMeta);
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

  /** PHASE 3: OUTPUT */

  // For calendar:
  if (!forList) return upcomingEvents;

  // For event list:
  upcomingEvents.sort((b, a) => {
    return new Date(b.eventDate) - new Date(a.eventDate);
  });

  return upcomingEvents.slice(0, size);
};
