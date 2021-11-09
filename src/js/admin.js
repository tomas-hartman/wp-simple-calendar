/**
 * @todo Rozpracovat víc, co chci, platné by mělo být:
 * - 10.1.2019  !! 1. října
 * - 1.6.2019   !! 6. ledna
 * - 2019-6-1      1. června
 * - 2019-12-24    24. prosince
 * - 24.12.2019 !! Invalid date
 *
 * - 2019-02-31 !! 3. března
 * - a ostatní, stringy spod.
 *
 * 10.1.2019#1.6.2019#2019-6-1#2019-12-24#2019-02-31#24.12.2019
 *
 * Pomocí regexu!
 *
 * Zatím testuje pouze, jestli tam nebylo vyloženě neplatné datum, string apod.
 *
 * @todo Vyřešit případ __31.2.2019__!
 */
export const handleInputDate = (value) => {
  const regex1 = /(\d{4}-((10|11|12)|(([0]\d)|\d{1})))-(3[0-5]|[0-2]\d|\b[1-9]\b)/g; // 2019-12-05
  const regex2 = /(3[0-5]|[0-2]\d|\b[1-9]\b).\s?((10|11|12)|(([0]\d)|\d{1})).\s?(\d{4})/g; // 12.6.2016

  const format = this.calFormat;
  const output = new Date(value);

  if (value.match(regex1)) {
    // pracuj s 2019-12-15
    value = value.split('-');
    const lastDayOfMonth = new Date(parseInt(value[0]), parseInt(value[1]), 0);
    const dayFromValue = new Date(parseInt(value[0]), parseInt(value[1]) - 1, parseInt(value[2]));
    if (dayFromValue > lastDayOfMonth) {
      return this.getDateString(lastDayOfMonth);
    }
    return this.getDateString(value.toString());
  } else if (value.match(regex2)) {
    // pracuj s 6.12.2019 a zjisti, jestli je to 6. prosince (cs) nebo 12. června (us)
    value = value.replace(/\s/g, '');
    value = value.split('.');
    let lastDayOfMonth = '';
    let dayFromValue = '';

    if (format === 'cs') {
      lastDayOfMonth = new Date(parseInt(value[2]), parseInt(value[1]), 0);
      dayFromValue = new Date(parseInt(value[2]), parseInt(value[1]) - 1, parseInt(value[0]));
    } else {
      console.warn('handleInputDate: format !== CS, date output handled as US');

      lastDayOfMonth = new Date(parseInt(value[2]), parseInt(value[0]), 0);
      dayFromValue = new Date(parseInt(value[2]), parseInt(value[0]) - 1, parseInt(value[1]));
    }

    if (dayFromValue > lastDayOfMonth) {
      return this.getDateString(lastDayOfMonth);
    }
    return this.getDateString(dayFromValue);
  } else if (output instanceof Date && !isNaN(output.valueOf())) { // tuhle podmínku promyslet, může jít o americké datum nebo tak něco
    return value;
  } else return this.getDateString(this.todayNorm); // když nic neklapne, je špatný datum a patří tam dnešní datum
};

export const adminGetDaysLength = (eventStart, eventEnd) => {
  const diff = new Date(eventEnd) - new Date(eventStart);
  const yearMs = 24 * 60 * 60 * 1000;
  const daysOffset = Math.floor(diff / yearMs) + 1; // rozdíl ve dnech - rozbíjelo by týdenní rozestupy

  return daysOffset;
};

// const anchorAdminMetabox = document.getElementById('swp-cal-metabox');

// if(anchorAdminMetabox) {

// }
