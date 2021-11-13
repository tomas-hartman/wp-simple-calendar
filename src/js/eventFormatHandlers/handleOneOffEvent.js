export const handleOneOffEvent = (eventPool, rawEvent, eventIsExpired, isList) => {
  /**
   * Used only with listing - not neccessary for calendar because
   * I want to be able to see past events in calendar
   */
  if (isList && eventIsExpired) return;

  eventPool.push(rawEvent);
};
