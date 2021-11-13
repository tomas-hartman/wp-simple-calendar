import { createApp } from '@vue/runtime-dom';
import AdminRepetition from './AdminRepetition.vue';
import AdminGeneral from './AdminGeneral.vue';
import './js/adminValidators';

createApp(AdminRepetition).mount('.swpc-admin-repetition');
createApp(AdminGeneral).mount('.swpc-admin-general');
