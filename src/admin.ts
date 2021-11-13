import { createApp } from '@vue/runtime-dom';
import AdminRepetition from './components/AdminRepetition.vue';
import AdminGeneral from './components/AdminGeneral.vue';
import './components/Admin/adminValidators';

createApp(AdminRepetition).mount('.swpc-admin-repetition');
createApp(AdminGeneral).mount('.swpc-admin-general');
