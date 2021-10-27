import { sample } from '../samples/data.mjs';

const today = new Date();
const todayNorm = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

/**
 * Konvertuje datum na date string, který používám v event.eventDate
 * @todo uplatnit na více místech, kde to potřebuju; možná nikde
 * @param {Date} date
 */
const getDateString = (date) => {
  const newDate = new Date(date);
  let dayString = newDate.getDate().toString();
  let monthString = (newDate.getMonth() + 1).toString();

  if (dayString.length === 1) {
    dayString = `0${dayString}`;
  }

  if (monthString.length === 1) {
    monthString = `0${monthString}`;
  }

  const dateString = `${newDate.getFullYear()}-${monthString}-${dayString}`;

  return dateString;
};

/**
   * Funkce, která vrací kopii objektu s upraveným datem konání
   * Vkládá se do objektu pro vytváření nadcházejících událostí
   * @param {object} event
   * @param {Date} date
   */
const createEventForList = (event, date, dateEnd) => {
  const eventCopy = JSON.parse(JSON.stringify(event)); // ohack na kopii objektu
  eventCopy.eventDate = getDateString(date);
  if (dateEnd) eventCopy.eventEndDate = getDateString(dateEnd);

  return eventCopy;
};

/**
 *
 * @param {array} events výsledek XHR requestu
 * @param {number} size počet dní, pro které chci akci vykreslit ->
 * tolikrát se maximálně může za sebou událost zobrazit
 * @todo __Přepsat celou metodu a rozdělit ji na jednotlivé funkce__
 */
export const getEventsData = (events, size) => {
  // const container = document.createElement('ul');
  // container.classList.add('swp-list');
  const upcomingEvents = [];
  // this.listRendered = true;

  /**
   * Pole s akcemi
   */
  for (let i = 0; i < events.length; i++) {
    const repeatMode = parseInt(events[i].eventRepeat);
    const daysLen = parseInt(events[i].eventDays);
    const eventStartDate = new Date(events[i].eventDate);
    let eventEndDate = '';
    let eventRepetitionEnd = '';

    // PHASE 1: GETTING DATA READY //

    if (events[i].eventEnd && events[i].eventEnd !== '0') {
      eventEndDate = new Date(events[i].eventEnd);
    } else {
      eventEndDate = new Date(events[i].eventDate);
      eventEndDate.setDate(eventEndDate.getDate() + (daysLen - 1));
    }

    if (events[i].eventRepetitionEnd && events[i].eventRepetitionEnd !== '0') {
      eventRepetitionEnd = new Date(events[i].eventRepetitionEnd);
    }

    // PHASE 2: PREPARING upcomingEvents //
    /**
     * 1. obyč nadcházející jednorázové akce
     */
    if (eventStartDate >= today && repeatMode === 0 && daysLen === 1) {
      upcomingEvents.push(events[i]);
    } else if (repeatMode === 0 && daysLen === 1) {
      console.log('This event has already expired but and is nothing wrong with it');
    }

    /**
   * 2. vícedenní akce @todo vícedenní opakované akce!
   * dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
   */
    else if (daysLen > 1 && (eventStartDate >= today || eventEndDate >= today) && repeatMode === 0) {
    // případ kdy akce končí po dnešku, ale začíná někdy dříve - i ty potřebuju použít
      if (eventStartDate < today && eventEndDate >= today) {
        upcomingEvents.push(createEventForList(events[i], eventStartDate, eventEndDate));
        continue;
      }
      // standardní případ, kdy akce začíná v budoucnosti
      upcomingEvents.push(createEventForList(events[i], eventStartDate, eventEndDate));
    } else if (daysLen > 1 && repeatMode === 0) {
      console.log('These are most likely multiple day events that have already expired');
    }

    /**
       * 3. opakující se akce
       *
       * @todo case 2 a case 3 jsou úplně totožné, rozdíl je v tom,
       * že u jednoho se přičítá jednička ke dni, u druhého k roku
       * @todo case 1 je kromě offsetu v případě prvního výskytu hodně blízký dalším casům
       */
    else if (repeatMode > 0) {
      switch (repeatMode) {
      case 1: // týdně
      /**
             * budu checkovat v jakej den se koná a přidám 'size' jejich instancí po datu today
             * @todo this.relmonth bude dělat chyby v tomhle případě! - mělo by být pokaždý nula, ne?
             */
        // let dayOfWeeklyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() /* + this.relMonth */, eventStartDate.getDate());
        let dayOfWeeklyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());

        for (let n = 0; n < size; n++) {
          if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break; // break for events terminated already in the past
          if (eventRepetitionEnd !== '' && dayOfWeeklyEvent > eventRepetitionEnd) break; // safe break for events ending in the future
          if (dayOfWeeklyEvent >= today) {
            upcomingEvents.push(createEventForList(events[i], dayOfWeeklyEvent));
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

            dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7 * weeksOffset);
            upcomingEvents.push(createEventForList(events[i], dayOfWeeklyEvent));
          }

          dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7);
        }
        break;

      case 2: // měsíční akce
        let eventRepetitionStart = eventStartDate;

        for (let n = 0; n < size; n++) {
          if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break; // break for events terminated already in the past

          if (eventRepetitionEnd !== '' && eventRepetitionStart > eventRepetitionEnd) break; // safe break for events ending in the future

          if (eventRepetitionStart < todayNorm) {
            eventRepetitionStart = new Date(today.getFullYear(), today.getMonth(), eventRepetitionStart.getDate());

            if (eventRepetitionStart < todayNorm) {
              eventRepetitionStart = new Date(eventRepetitionStart.getFullYear(), eventRepetitionStart.getMonth() + 1, eventRepetitionStart.getDate());
            }
          }

          upcomingEvents.push(createEventForList(events[i], eventRepetitionStart));
          eventRepetitionStart = new Date(eventRepetitionStart.getFullYear(), eventRepetitionStart.getMonth() + 1, eventRepetitionStart.getDate());
        }
        break;

      case 3: // roční akce
        let dayOfYearlyEvent = eventStartDate;

        for (let n = 0; n < size; n++) {
          if (eventRepetitionEnd !== '' && eventRepetitionEnd < todayNorm) break;

          if (eventRepetitionEnd !== '' && dayOfYearlyEvent > eventRepetitionEnd) break;

          if (dayOfYearlyEvent < todayNorm) {
            dayOfYearlyEvent = new Date(today.getFullYear(), dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());

            // pokud je stále ještě menší, pak jde o událost, která už letos proběhla a je třeba ji přeskočit
            if (dayOfYearlyEvent < todayNorm) {
              dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
            }
          }

          upcomingEvents.push(createEventForList(events[i], dayOfYearlyEvent));
          dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
        }

        break;

      default:
        console.warn(`Event repeatMode non-standard: ${repeatMode}`);
        break;
      }
    } else {
    // FALLBACK IF NOTHING WORKS OUT WELL
      console.warn('Event non-standard or broken data:');
      console.warn(events[i]);
    }
  }

  return upcomingEvents;
};

// console.log(getEventsData(sample, 7));
