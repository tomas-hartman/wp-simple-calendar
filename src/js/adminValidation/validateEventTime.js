import { createAdminValidationErr } from '../helpersAdmin';

export const validateEventTime = (clickEvent, hoursElement, regexHour) => {
  if (!hoursElement.value === '' || !hoursElement.value.match(regexHour)) {
    // const text = 'Čas události je ve špatném formátu. Zadejte čas ve formátu 8:45, 18:00 nebo rozmezí 12:30-13:10.';
    const text = 'Čas události je ve špatném formátu. Zadejte čas ve formátu 8:45 nebo 18:00.';

    createAdminValidationErr(text, hoursElement);
    clickEvent.preventDefault ? clickEvent.preventDefault() : clickEvent.returnValue = false;
  }
};
