export const handleOneOffEvent = (eventPool, rawEvent, eventIsExpired) => {
  // if (!eventIsExpired) {
  //   console.log('This event has already expired but and is nothing wrong with it');
  //   return;
  // }

  eventPool.push(rawEvent);
};
