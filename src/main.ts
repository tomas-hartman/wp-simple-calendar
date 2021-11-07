import { createApp } from 'vue';
import Calendar from './CalendarMain.vue';
import EventList from './EventListMain.vue';

createApp(Calendar).mount('.swpc');
createApp(EventList).mount('.swpc-list');
