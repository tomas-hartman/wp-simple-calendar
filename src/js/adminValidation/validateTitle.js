import { createAdminValidationErr } from '../helpersAdmin';

export const validateTitle = (event, titleElement) => {
  if (titleElement.value.trim() === '') {
    const text = 'Vyplňte název události.';
    createAdminValidationErr(text, titleElement);

    event.preventDefault ? event.preventDefault() : event.returnValue = false;
  }
};
