/**
 * Returns meta object that is used to generate event
 * @param {*} rawEvent
 * @param {Date} today
 * @param {Date} todayNorm
 * @returns
 */
export const getEventMeta = (rawEvent, today, todayNorm) => {
  const daysLen = parseInt(rawEvent.eventDays);
  const eventStartDate = new Date(rawEvent.eventDate);

  const prepareEventEndDate = (rawEvent) => {
    if (rawEvent.eventEnd && rawEvent.eventEnd !== '0') {
      return new Date(rawEvent.eventEnd);
    } else {
      const output = new Date(rawEvent.eventDate);
      output.setDate(output.getDate() + (daysLen - 1));

      return output;
    }
  };

  const prepareEventRepetitionEnd = () => {
    if (rawEvent.eventRepetitionEnd && rawEvent.eventRepetitionEnd !== '0') {
      return new Date(rawEvent.eventRepetitionEnd);
    }

    return ''; // null
  };

  const eventEndDate = prepareEventEndDate(rawEvent);
  const eventRepetitionEnd = prepareEventRepetitionEnd();

  return {
    eventIsExpired: eventStartDate < today,
    eventEndsInTheFuture: eventEndDate >= today,
    eventStartDate,
    eventEndDate,
    today,
    todayNorm,
    eventRepetitionEnd,
    repeatMode: parseInt(rawEvent.eventRepeat),
    daysLen,
  };
};
