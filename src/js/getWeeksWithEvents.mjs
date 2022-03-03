/**
 * @todo This is completely wierd and needs refactor, but I want to make it work for now.
 */
export const getWeeksWithEvents = (firstDayOfMonth, weeksMeta, eventsData) => {
  const merged = weeksMeta.map((dayMeta) => {
    const { dateObj } = dayMeta;
    const dateStr = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

    const monthMetaDateTime = new Date(dateStr).getTime();

    const eventsOfTheDay = eventsData.filter((event) => {
      const eventDateTime = new Date(event.eventDate).getTime();

      return monthMetaDateTime === eventDateTime;
    });

    if (eventsOfTheDay.length >= 1) {
      return {
        ...dayMeta,
        events: eventsOfTheDay,
      };
    }

    return dayMeta;
  });

  return merged;
};
