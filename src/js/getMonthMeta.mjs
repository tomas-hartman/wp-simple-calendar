export default function getMonthMeta (monthOffset) {
  const today = new Date(); // date of today

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset);
  const firstDayOfNextMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1);
  const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0);
  const lastDayOfPrevMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 0);
  const displayedMonth = firstDayOfMonth.getMonth() + 1;

  // při přeměně času na zimní může mít jiný počet hodin @todo je správně floor?!
  const numOfDays = Math.floor((firstDayOfNextMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24));

  return {
    firstDayOfMonth, firstDayOfNextMonth, lastDayOfMonth, lastDayOfPrevMonth, displayedMonth, numOfDays,
  };
}

// console.log(getMonthMeta(0));

// module.exports = getMonthMeta;
