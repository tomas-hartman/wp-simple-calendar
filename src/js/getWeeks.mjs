const createDayMeta = (date, weekdayNum) => {
  return {
    date,
    weekdayNum,
  };
};

/**
 * Hlavní funkce
 * Vygeneruje strukturu kalendáře pro jednotlivé dny
 * @returns DOM s vytvořenými elementy pro jednotlivé dny
 * @access main generování kalendáře a refreshData()
 */
export default function getWeeks (numOfDays, firstDayOfMonth) {
  const days = [];

  let firstWeekConst = false;
  let firstDay = firstDayOfMonth.getDay();

  if (firstDay === 0) {
    firstDay = 7;
  }

  const arbitraryDaysArr = Array.from(Array(numOfDays).keys());

  while (arbitraryDaysArr.length > 0) {
    for (let i = 1; i < 8; i++) {
      if (i >= firstDay && !firstWeekConst) { // Případ, kdy měsíc začíná o víkendu
        const daysArrItem = arbitraryDaysArr.shift();
        const dayElm = createDayMeta(daysArrItem + 1, i);
        firstWeekConst = true;

        days.push(dayElm); // RENDER FULL
        continue;
      }

      if (firstWeekConst && arbitraryDaysArr.length > 0) {
        const daysArrItem = arbitraryDaysArr.shift();
        const dayElm = createDayMeta(daysArrItem + 1, i);

        days.push(dayElm); // RENDER FULL
        continue;
      }

      days.push(createDayMeta(null, i)); // RENDER EMPTY
    }
  }
  return days;
}
