import { createAdminValidationErr } from '../helpersAdmin';

export const validateEventLength = (clickEvent, check, eventStartElm, eventEndElm) => {
  if (!check.checked) return;

  const dateDiff = new Date(eventEndElm.value).getTime() - new Date(eventStartElm.value).getTime();

  if (dateDiff > 0) return;

  if (dateDiff < 0) {
    const text = 'Počet dní je neplatný. Vícedenní událost nemůže končit v minulosti ani ve stejný den, kdy začala.';
    createAdminValidationErr(text, eventEndElm);
    clickEvent.preventDefault ? clickEvent.preventDefault() : clickEvent.returnValue = false;
    return;
  }

  const text = 'Počet dní je neplatný. Zkontrolujte formát data události.';
  createAdminValidationErr(text, eventEndElm, false);
  clickEvent.preventDefault ? clickEvent.preventDefault() : clickEvent.returnValue = false;
};
