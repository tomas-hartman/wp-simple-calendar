<template>
    <MonthController :month="month" :year="year" />
    <div class="swpc-body">
      <div class="weekdays">
        <ul class="swp-cal-weekdays">
          <li v-bind:key="weekday" v-for="weekday in weekdays">{{weekday}}</li>
        </ul>
      </div>
      <Days />
    </div>
</template>

<script>
import MonthController from './MonthController.vue';
import Days from './Days.vue';

export default {
  name: 'Calendar',
  props: {
    // month: String,
  },
  data() {
    return {
      weekdays: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
      month: 'srpen',
      year: 2021,
    };
  },
  components: {
    MonthController,
    Days,
  },
};
</script>
