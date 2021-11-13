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
/**
 * @todo Upravit, aby se nerenderovalo x-krát, možná upravit, aby se vytvářelo přes PHP
 */
const createAdminValidationErr = (text, origin, renderFrame = true) => {
  const placeholder = document.querySelector('.wp-header-end');
  const messageDiv = document.createElement('div');
  messageDiv.id = 'message';
  messageDiv.classList.add('notice', 'notice-error', 'is-dismissible', 'validation-error');

  const errorMsgUl = document.createElement('ul');
  const errorMsg = document.createElement('li');
  errorMsg.classList.add('error');
  errorMsg.innerText = text;

  errorMsgUl.appendChild(errorMsg);
  messageDiv.appendChild(errorMsgUl);

  placeholder.parentNode.insertBefore(messageDiv, placeholder.nextSibling);

  if (!renderFrame) return;
  origin.style.borderColor = '#a00';
  origin.style.backgroundColor = 'rgba(170, 0, 0, 0.1)';
};

export const adminValidate = (el) => {
  const eventEndElement = document.querySelector('#swp-cal-event-date-end');
  const eventStartElement = document.querySelector('#swp-cal-event-date');
  const numOfDaysElm = document.querySelector('#swp-cal-event-num-days');
  const hoursElement = document.querySelector('#swp-cal-event-time');
  const titleElement = document.getElementsByName('post_title')[0];
  const validateErrors = document.querySelectorAll('.notice.validation-error');

  validateErrors.forEach((notice) => {
    notice.remove();
  });

  const regexYear = /(\d{4}-(0\d|(10|11|12))-(0[1-9]|[1-2]\d|(30|31)))|(^$)/g;
  const regexHour = /((\D\d|1\d|2[0-3]):[0-5]\d-(\d{1}|1\d|2[0-3]):[0-5]\d|(\D\d|1\d|2[0-3]):[0-5]\d)|(^$)/g;

  if (titleElement.value.trim() === '') {
    const text = 'Vyplňte název události.';
    createAdminValidationErr(text, titleElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!eventStartElement.value.match(regexYear)) {
    const text = 'Datum události je ve špatném formátu. Vyberte datum z kalendáře nebo jej napište ve formátu 2019-11-04.';
    createAdminValidationErr(text, eventStartElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!eventEndElement.disabled && !eventEndElement.value.match(regexYear)) {
    const text = 'Datum konce události je ve špatném formátu. Vyberte datum z kalendáře nebo jej napište ve formátu 2019-11-04.';
    createAdminValidationErr(text, eventEndElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (numOfDaysElm.innerText === 'NaN' || parseInt(numOfDaysElm.innerText) < 1) {
    if (document.querySelector('#swp-cal-event-date-end-chck').checked && parseInt(numOfDaysElm.innerText) <= 1) {
      const text = 'Počet dní je neplatný. Vícedenní událost nemůže končit v minulosti ani ve stejný den, kdy začala.';
      createAdminValidationErr(text, numOfDaysElm, false);
    } else {
      const text = 'Počet dní je neplatný. Zkontrolujte formát data události.';
      createAdminValidationErr(text, numOfDaysElm, false);
    }

    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!hoursElement.value === '' || !hoursElement.value.match(regexHour)) {
    const text = 'Čas události je ve špatném formátu. Zadejte čas ve formátu 8:45, 18:00 nebo rozmezí 12:30-13:10.';
    createAdminValidationErr(text, hoursElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }
};
