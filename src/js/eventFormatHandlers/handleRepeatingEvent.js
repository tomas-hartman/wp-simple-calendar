import { createEventForList } from './getFormatedEventsDataHelpers';

/**
 * 3. opakující se akce
 *
 * @todo case 2 a case 3 jsou úplně totožné, rozdíl je v tom,
 * že u jednoho se přičítá jednička ke dni, u druhého k roku
 * @todo case 1 je kromě offsetu v případě prvního výskytu hodně blízký dalším casům
 *
 * @param {*} eventPool
 * @param {*} rawData
 * @param {*} eventMeta
 * @param {*} count
 */
export const handleRepeatingEvent = (
  eventPool, rawData, eventMeta, count = 10,
) => {
  const {
    eventStartDate,
    today,
    todayNorm,
    eventRepetitionEnd,
    repeatMode,
  } = eventMeta;

  switch (repeatMode) {
  case 1: // týdně
    /**
     * budu checkovat v jakej den se koná a přidám 'count' jejich instancí po datu today
     * @todo relmonth bude dělat chyby v tomhle případě! - mělo by být pokaždý nula, ne?
     */
    let dayOfWeeklyEvent = new Date(
      eventStartDate.getFullYear(),
      eventStartDate.getMonth(),
      eventStartDate.getDate(),
    );

    for (let n = 0; n < count; n++) {
      if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break; // break for events terminated already in the past
      if (eventRepetitionEnd !== '' && dayOfWeeklyEvent > eventRepetitionEnd) break; // safe break for events ending in the future
      if (dayOfWeeklyEvent >= today) {
        eventPool.push(createEventForList(rawData, dayOfWeeklyEvent));
      } else {
        // Pokud opakovaná událost začíná v minulosti
        /**
         * tady to je potřeba opravit o rozdíl mezi prvním dnem v týdnu/akce
         * tady je potřeba
         */
        const diff = today - dayOfWeeklyEvent;
        const yearMs = 24 * 60 * 60 * 1000;
        const daysOffset = Math.floor(diff / yearMs); // rozdíl ve dnech - rozbíjelo by týdenní rozestupy
        const weeksOffset = Math.ceil(daysOffset / 7); // rozdíl v týdnech - ten potřebuju, abych zachoval týdenní rozestupy

        dayOfWeeklyEvent = new Date(
          dayOfWeeklyEvent.getFullYear(),
          dayOfWeeklyEvent.getMonth(),
          dayOfWeeklyEvent.getDate() + 7 * weeksOffset,
        );
        eventPool.push(createEventForList(rawData, dayOfWeeklyEvent));
      }

      dayOfWeeklyEvent = new Date(
        dayOfWeeklyEvent.getFullYear(),
        dayOfWeeklyEvent.getMonth(),
        dayOfWeeklyEvent.getDate() + 7,
      );
    }
    break;

  case 2: // měsíční akce
    let eventRepetitionStart = eventStartDate;

    for (let n = 0; n < count; n++) {
      if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break; // break for events terminated already in the past

      if (
        eventRepetitionEnd !== '' &&
        eventRepetitionStart > eventRepetitionEnd
      ) break; // safe break for events ending in the future

      if (eventRepetitionStart < todayNorm) {
        eventRepetitionStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          eventRepetitionStart.getDate(),
        );

        if (eventRepetitionStart < todayNorm) {
          eventRepetitionStart = new Date(
            eventRepetitionStart.getFullYear(),
            eventRepetitionStart.getMonth() + 1,
            eventRepetitionStart.getDate(),
          );
        }
      }

      eventPool.push(createEventForList(rawData, eventRepetitionStart));
      eventRepetitionStart = new Date(
        eventRepetitionStart.getFullYear(),
        eventRepetitionStart.getMonth() + 1,
        eventRepetitionStart.getDate(),
      );
    }
    break;

  case 3: // roční akce
    let dayOfYearlyEvent = eventStartDate;

    for (let n = 0; n < count; n++) {
      if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break;

      if (eventRepetitionEnd !== '' && dayOfYearlyEvent > eventRepetitionEnd) break;

      if (dayOfYearlyEvent < todayNorm) {
        dayOfYearlyEvent = new Date(
          today.getFullYear(),
          dayOfYearlyEvent.getMonth(),
          dayOfYearlyEvent.getDate(),
        );

        // pokud je stále ještě menší, pak jde o událost, která už letos proběhla a je třeba ji přeskočit
        if (dayOfYearlyEvent < todayNorm) {
          dayOfYearlyEvent = new Date(
            dayOfYearlyEvent.getFullYear() + 1,
            dayOfYearlyEvent.getMonth(),
            dayOfYearlyEvent.getDate(),
          );
        }
      }

      eventPool.push(createEventForList(rawData, dayOfYearlyEvent));
      dayOfYearlyEvent = new Date(
        dayOfYearlyEvent.getFullYear() + 1,
        dayOfYearlyEvent.getMonth(),
        dayOfYearlyEvent.getDate(),
      );
    }

    break;

  default:
    console.warn(`Event repeatMode non-standard: ${repeatMode}`);
    break;
  }
};
