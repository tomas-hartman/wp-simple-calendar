/**
 * @todo This is completely wierd and needs refactor, but I want to make it work for now.
 */
export const getWeeksWithEvents = (firstDayOfMonth, weeksMeta, eventsData) => {
  const thisMonth = new Date(firstDayOfMonth);

  const year = thisMonth.getFullYear();
  const month = thisMonth.getMonth() + 1;

  const merged = weeksMeta.map((dayMeta) => {
    const monthMetaDateTime = new Date(`${year}-${month}-${dayMeta.date}`).getTime();

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
