export const isToday = (date) => {
  const today = new Date();

  return isSameDay(date, today);
};

export const isSameDay = (firstDay, secondDay) => {
  return firstDay.getDate() === secondDay.getDate() &&
  firstDay.getMonth() === secondDay.getMonth() &&
  firstDay.getFullYear() === secondDay.getFullYear();
};

export const formatDate = (date) => {
  const formatedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return formatedDate;
};
