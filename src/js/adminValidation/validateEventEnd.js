import { createAdminValidationErr } from '../helpersAdmin';

export const validateEventEnd = (clickEvent, eventEndElement, regexYear) => {
  if (!eventEndElement.disabled && !eventEndElement.value.match(regexYear)) {
    const text = 'Datum konce události je ve špatném formátu. Vyberte datum z kalendáře nebo jej napište ve formátu 2019-11-04.';

    createAdminValidationErr(text, eventEndElement);
    clickEvent.preventDefault ? clickEvent.preventDefault() : clickEvent.returnValue = false;
  }
};
