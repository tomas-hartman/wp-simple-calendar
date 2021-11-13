import { createAdminValidationErr } from '../helpersAdmin';

export const validateEventDate = (clickEvent, element, regexYear) => {
  if (!element.value.match(regexYear)) {
    const text = 'Datum události je ve špatném formátu. Vyberte datum z kalendáře nebo jej napište ve formátu 2019-11-04.';

    createAdminValidationErr(text, element);
    clickEvent.preventDefault ? clickEvent.preventDefault() : clickEvent.returnValue = false;
  }
};
