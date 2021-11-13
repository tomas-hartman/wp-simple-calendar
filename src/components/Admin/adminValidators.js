import { adminValidate } from '../../js/helpersAdmin';

/**
 * This is not entirely a component but is treated as such and imported where components are often
 * imported.
 */

const publishButton = document.querySelector('#publish');

if (publishButton) {
  publishButton.addEventListener('click', adminValidate);
}
