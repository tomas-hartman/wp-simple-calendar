import getMonthMeta from './getMonths.mjs';

const createDayMeta = (date, weekdayNum, isWeekend = false) => {
  return {
    date,
    weekdayNum,
    isWeekend,
  };
};

/**
 * Hlavní funkce
 * Vygeneruje strukturu kalendáře pro jednotlivé dny
 * @returns DOM s vytvořenými elementy pro jednotlivé dny
 * @access main generování kalendáře a refreshData()
 */
export default function getWeeks () {
  const { daysArr, firstDayOfMonth } = getMonthMeta(0);

  // const days = document.createElement('ul');
  // const daysArr = [];
  const days = [];
  // days.setAttribute('class', 'days');

  let firstWeekConst = false;
  let firstDay = firstDayOfMonth.getDay();

  if (firstDay === 0) {
    firstDay = 7;
  }

  while (daysArr.length > 0) {
    for (let i = 1; i < 8; i++) {
      if (i >= firstDay && !firstWeekConst) { // Případ, kdy měsíc začíná o víkendu
        const daysArrItem = daysArr.shift();
        const isWeekend = (i === 6 || i === 7);
        const dayElm = createDayMeta(daysArrItem, i, isWeekend);
        firstWeekConst = true;

        days.push(dayElm); // RENDER FULL
        continue;
      }

      if (firstWeekConst && daysArr.length > 0) {
        const daysArrItem = daysArr.shift();
        const isWeekend = (i === 6 || i === 7);
        const dayElm = createDayMeta(daysArrItem, i, isWeekend);

        days.push(dayElm); // RENDER FULL
        continue;
      }

      days.push(createDayMeta(null, i)); // RENDER EMPTY
    }
  }
  return days;
}

// console.log(getWeeks());
