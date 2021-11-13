const createDayMeta = (dayNum, weekdayNum, monthMetaDate, monthType = 'current') => {
  const date = new Date(monthMetaDate.getFullYear(), monthMetaDate.getMonth(), dayNum);

  return {
    date: date.getDate(),
    dateObj: date,
    weekdayNum,
    monthType,
  };
};

/**
 * Hlavní funkce
 * Vygeneruje strukturu kalendáře pro jednotlivé dny
 * @returns DOM s vytvořenými elementy pro jednotlivé dny
 * @access main generování kalendáře a refreshData()
 */
export default function getWeeks (monthMeta) {
  const { numOfDays, firstDayOfMonth, lastDayOfPrevMonth, firstDayOfNextMonth } = monthMeta;
  const days = [];

  let firstWeekConst = false;
  let firstDay = firstDayOfMonth.getDay();

  if (firstDay === 0) {
    firstDay = 7;
  }

  const firstDayOfPrevMonthInCal = lastDayOfPrevMonth.getDate();
  const arbitraryDaysArr = Array.from(Array(numOfDays).keys());

  while (arbitraryDaysArr.length > 0) {
    let nextMonthDay = 0;
    let prevMonthDay = 0;

    for (let i = 1; i < 8; i++) {
      if (i >= firstDay && !firstWeekConst) { // Případ, kdy měsíc začíná o víkendu
        const daysArrItem = arbitraryDaysArr.shift();
        const dayElm = createDayMeta(daysArrItem + 1, i, firstDayOfMonth);
        firstWeekConst = true;

        days.push(dayElm); // RENDER FULL
        continue;
      }

      if (firstWeekConst && arbitraryDaysArr.length > 0) {
        const daysArrItem = arbitraryDaysArr.shift();
        const dayElm = createDayMeta(daysArrItem + 1, i, firstDayOfMonth);

        days.push(dayElm); // RENDER FULL
        continue;
      }

      // next month
      if (arbitraryDaysArr.length < 1 && i < 8) {
        nextMonthDay = nextMonthDay + 1;
        days.push(createDayMeta(nextMonthDay, i, firstDayOfNextMonth, 'next'));
        continue;
      }

      // previous month. note that this goes back to front, so I need to subtract the days
      days.unshift(createDayMeta(firstDayOfPrevMonthInCal - prevMonthDay, firstDay - prevMonthDay - 1, lastDayOfPrevMonth, 'prev'));
      prevMonthDay += 1;
    }
  }

  return days;
}
