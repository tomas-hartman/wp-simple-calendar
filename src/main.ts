import { createApp } from 'vue';
import Calendar from './CalendarMain.vue';
import EventList from './EventListMain.vue';
import AdminRepetition from './AdminRepetition.vue';
import AdminGeneral from './AdminGeneral.vue';

createApp(Calendar).mount('.swpc');
createApp(EventList).mount('.swpc-list');
createApp(AdminRepetition).mount('.swpc-admin-repetition');
createApp(AdminGeneral).mount('.swpc-admin-general');
