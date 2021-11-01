<template>
  <ul class="days">
    <li
      v-for="day in days.days"
      :key="day"
      v-bind:class="[
        (day.weekdayNum === 6 || day.weekdayNum === 7) && 'weekend',
        (day.events?.length > 0) && 'has-events',
        isToday(day.dateObj) && 'today',
        (day.monthType !== 'current') && 'bordering-month'
      ]"
    >
      <span class="dayInMonth">
      {{day.date}}
      </span>
      <ul class="events" v-if="day.events?.length">
        <li class="event" v-for="event in day.events" :key="event">{{event.title}}</li>
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
import { isToday } from '../js/helpers';

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
      this.days = getCalendarData(this.monthOffset, this.events);
    },
  },
  methods: {
    isToday: isToday,
  },
  created () {
    console.log(this.days);
    console.log(this.events);
  },
};
</script>

<style lang="scss">
.swpc {
  .has-events {
    position: relative;
  }

  .has-events:hover .events {
    display: block;
  }

  .events {
    display: none;
    position: absolute;
    // width: 150px;
    z-index: 100;
    background-color: var(--aluminium);
    // width: auto;
    max-width: var(--main-width);
    font-size: 0.85em;
    padding: 0.6rem;
    text-align: left;
    width: 200px;
    padding-left: 1rem;
    color: initial;
  }

  .event {
    line-height: normal;
    width: 100%;
    list-style-type: disc;
    display: inline-block;
  }

  .days > li {
    background-color: var(--clouds-white);
  }

  .days > li:last-of-type {
    border-radius: 0 0 9px 0;
  }

  .days > li:nth-last-of-type(7) {
    border-radius: 0 0 0 9px;
  }

  .days .weekend {
    background-color: var(--calendar-light-grey);
  }

  .days .bordering-month {
    color: var(--silver);
  }

  /* Highlight event */
  // .days li {
  // background-color: #bdc3c7;

  // &.weekend {
  //   // background-color: #7f8c8d80;
  //   background-color: rgba(0, 0, 0, 0.2);
  // }

  .days {
    // padding: 9px 0;
    // background-color: rgba(var(--clouds-white-rgb), 0.4);
    // border-radius: 0 0 9px 9px;
  }

  .days .today {
    background: #2c3e50;
    color: #bdc3c7 !important;
    display: block;
  }

  .days .has-events {
    background-color: var(--purple-light);
    box-shadow: 0 4px var(--purple) inset;
    color: var(--clouds-white);
    // display: block;
  }

  .days .has-events.bordering-month,
  .days .has-events.bordering-month.today,
  .days .bordering-month.today
  {
    color: var(--concrete);
    background-color: var(--aluminium);
    box-shadow: none;
  }

  .days .has-events.bordering-month,
  .days .has-events.bordering-month.today {
    box-shadow: 0 4px var(--concrete) inset;
  }

  .days .has-events.today,
  .days .has-events.today.weekend {
    background-color: var(--navy-dark);
    box-shadow: 0 4px var(--purple-light) inset;
    color: var(--clouds-white-rgb);
  }

  .days .has-events.weekend {
    background-color: var(--purple);
    box-shadow: 0 4px var(--purple-dark) inset;
  }
}
</style>
