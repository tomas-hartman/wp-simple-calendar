<template>
    <MonthController :month="month" :year="year" />
    <div class="swpc-body">
      <div class="weekdays">
        <ul class="swp-cal-weekdays">
          <li v-bind:key="weekday" v-for="weekday in weekdays">{{weekday}}</li>
        </ul>
      </div>
      <Days :month="month" :year="year" :data="data" />
    </div>
</template>

<script>
import MonthController from './MonthController.vue';
import Days from './Days.vue';

export default {
  name: 'Calendar',
  props: {
    data: Array,
  },
  data () {
    return {
      weekdays: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
      month: 7,
      year: 2021,
    };
  },
  created () {
    console.log(this.weekdays, this.month, this.year);
  },
  components: {
    MonthController,
    Days,
  },
};
</script>
