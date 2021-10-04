<template>
    <MonthController :month="today.getMonth()" :year="today.getFullYear()" />
    <div class="swpc-body">
      <WeekdaysHeader />
      <Days :data="monthData" />
    </div>
</template>

<script>
import MonthController from './MonthController.vue';
import WeekdaysHeader from './WeekdaysHeader.vue';
import Days from './Days.vue';
import getWeeks from '../js/getWeeks';

export default {
  name: 'Calendar',
  data () {
    return {
      today: new Date(),
      /** This should be 1.X.20XY according to the relative month */
      relativeMonth: new Date(),
      monthOffset: 0,
      monthData: getWeeks(this.monthOffset),
    };
  },
  created () {
    // console.log(this.today, this.monthData);
  },
  components: {
    MonthController,
    Days,
    WeekdaysHeader,
  },
};
</script>
