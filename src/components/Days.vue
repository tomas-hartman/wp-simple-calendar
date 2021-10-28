<template>
  <ul class="days">
    <li
      v-for="day in days.days"
      :key="day"
      v-bind:class="[(day.weekdayNum === 6 || day.weekdayNum === 7) && 'weekend']"
    >
      <span class="dayInMonth">
      {{day.date}}
      </span>
      <ul class="event" v-if="day.events?.length">
        <li v-for="event in day.events" :key="event">{{event.title}}</li>
      </ul>
    </li>

    <!-- <li>
      <span id="day-18" class="event tooltip">18</span>
      <span class="day-events">
        <ul>
          <li>
            <a href="https://www.skolahradecns.cz/event/zahajeni-prazdninoveho-provozu-ms/">
            Zahájení prázdninového provozu MŠ</a>
          </li>
        </ul>
      </span>
    </li> -->
  </ul>
</template>

<script>
import { getCalendarData } from '../js/getCalendarData';

export default {
  name: 'Days',
  props: {
    monthOffset: Number,
    events: Object,
  },
  data () {
    return {
      days: getCalendarData(this.monthOffset, this.events),
    };
  },
  watch: {
    monthOffset () {
      this.days = getCalendarData(this.monthOffset);
    },
  },
  created () {
    console.log(this.days);
  },
};
</script>
