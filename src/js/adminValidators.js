import { adminValidate } from './admin';

const publishButton = document.querySelector('#publish');

if (publishButton) {
  publishButton.addEventListener('click', adminValidate);
}
