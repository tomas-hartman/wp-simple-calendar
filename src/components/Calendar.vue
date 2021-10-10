<template>
    <MonthController
      @decrease-month-offset="decreaseOffset"
      @increase-month-offset="increaseOffset"
      :month="relativeMonth.getMonth()"
      :year="relativeMonth.getFullYear()"
    />
    <div class="swpc-body">
      <WeekdaysHeader />
      <Days :monthOffset="monthOffset" />
    </div>
</template>

<script>
import MonthController from './MonthController.vue';
import WeekdaysHeader from './WeekdaysHeader.vue';
import Days from './Days.vue';

export default {
  name: 'Calendar',
  data () {
    return {
      today: new Date(),
      /** This should be 1.X.20XY according to the relative month */
      relativeMonth: new Date(),
      monthOffset: 0,
    };
  },
  methods: {
    decreaseOffset () {
      this.monthOffset -= 1;
      this.relativeMonth = new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset, 1);
    },
    increaseOffset () {
      this.monthOffset += 1;
      this.relativeMonth = new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset, 1);
    },
  },
  // created () {

  // },
  components: {
    MonthController,
    Days,
    WeekdaysHeader,
  },
};
</script>
