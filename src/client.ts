import { createApp } from 'vue';
import Calendar from './components/CalendarMain.vue';
import EventList from './components/EventListMain.vue';

createApp(Calendar).mount('.swpc');
createApp(EventList).mount('.swpc-list');
