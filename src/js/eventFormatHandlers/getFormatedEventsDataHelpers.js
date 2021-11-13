import { sample } from '../../samples/data';

/**
 * Konvertuje datum na date string, který používám v event.eventDate
 * @todo uplatnit na více místech, kde to potřebuju; možná nikde
 * @param {Date} date
 */
export const getDateString = (date) => {
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
export const createEventForList = (event, date, dateEnd) => {
  const eventCopy = JSON.parse(JSON.stringify(event)); // ohack na kopii objektu
  eventCopy.eventDate = getDateString(date);
  if (dateEnd) eventCopy.eventEndDate = getDateString(dateEnd);

  return eventCopy;
};
