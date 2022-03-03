<template>
    <MonthController
      @decrease-month-offset="decreaseOffset"
      @increase-month-offset="increaseOffset"
      :month="relativeMonth.getMonth()"
      :year="relativeMonth.getFullYear()"
    />
    <div class="swpc-body">
      <WeekdaysHeader />
      <Days :monthOffset="monthOffset" :events="events" />
    </div>
</template>

<script>
import MonthController from './MonthController.vue';
import WeekdaysHeader from './WeekdaysHeader.vue';
import Days from './Days.vue';
import axios from 'axios';
import { getFormatedEventsData } from '../../js/getFormatedEventsData';

export default {
  name: 'Calendar',
  data () {
    return {
      today: new Date(),
      /** This should be 1.X.20XY according to the relative month */
      relativeMonth: new Date(),
      monthOffset: 0,
      events: [],
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
  async mounted () {
    if (process.env.NODE_ENV !== 'production') {
      const { dataRest } = await import(
        /* webpackChunkName: "chunk-sample-data" */
        '../../samples/data_rest'
      );

      this.events = getFormatedEventsData(dataRest, 10);

      // const { data } = await axios.get('http://skolahradecns20.local/wp-json/swpc/v1/events');
      // this.events = getFormatedEventsData(data, 10);
      return;
    }

    const { data } = await axios.get('/wp-json/swpc/v1/events');

    this.events = getFormatedEventsData(data, 10);
  },
  components: {
    MonthController,
    Days,
    WeekdaysHeader,
  },
};
</script>
