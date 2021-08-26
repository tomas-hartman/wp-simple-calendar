<template>
  <ul class="days">
    <li
      v-for="day in days"
      :key="day"
      v-bind:class="[(day.day === 6 || day.day === 7) && weekendCls]"
    >
      <span class="dayInMonth">
      {{day.date}}
      </span>
      <ul class="event" v-if="day.events?.length">
        <li v-for="event in day.events" :key="event">{{event.title}}</li>
      </ul>
    </li>


    <!-- <li class="weekend"><span id="day-01">1</span></li>
    <li><span id="day-02">2</span></li>
    <li><span id="day-03">3</span></li>
    <li><span id="day-04">4</span></li>
    <li><span id="day-05">5</span></li>
    <li><span id="day-06">6</span></li>
    <li class="weekend"><span id="day-07">7</span></li>
    <li class="weekend"><span id="day-08">8</span></li>
    <li><span id="day-09">9</span></li>
    <li><span id="day-10">10</span></li>
    <li><span id="day-11">11</span></li>
    <li><span id="day-12">12</span></li>
    <li><span id="day-13">13</span></li>
    <li class="weekend"><span id="day-14">14</span></li>
    <li class="weekend"><span id="day-15">15</span></li>
    <li><span id="day-16">16</span></li>
    <li><span id="day-17">17</span></li>
    <li>
      <span id="day-18" class="event tooltip">18</span>
      <span class="day-events">
        <ul>
          <li>
            <a href="https://www.skolahradecns.cz/event/zahajeni-prazdninoveho-provozu-ms/">
            Zahájení prázdninového provozu MŠ</a>
          </li>
        </ul>
      </span>
    </li>
    <li><span id="day-19">19</span></li>
    <li><span id="day-20">20</span></li>
    <li class="weekend"><span id="day-21">21</span></li>
    <li class="weekend"><span id="day-22">22</span></li>
    <li><span id="day-23">23</span></li>
    <li><span id="day-24">24</span></li>
    <li><span class="active" id="day-25">25</span></li>
    <li><span id="day-26">26</span></li>
    <li><span id="day-27">27</span></li>
    <li class="weekend"><span id="day-28">28</span></li>
    <li class="weekend"><span id="day-29">29</span></li>
    <li><span id="day-30">30</span></li>
    <li><span id="day-31">31</span></li> -->
  </ul>
</template>

<script>
import {sample} from '../samples/data';

export default {
  name: 'Days',
  props: {
    month: Number,
    year: Number,
    data: Object,
  },
  data() {
    return {
      days: [
        {day: 1},
        {day: 2},
        {day: 3},
        {day: 4},
        {date: 1, day: 5},
        {date: 2, day: 6},
        {date: 3, day: 7},
        {date: 4, day: 1},
        {date: 5, day: 2, events: [sample[9], sample[16]]},
        {date: 6, day: 3},
        {date: 7, day: 4},
        {date: 8, day: 5},
        {date: 9, day: 6},
        {date: 10, day: 7},
        {date: 11, day: 1},
        {date: 12, day: 2},
        {date: 13, day: 3},
        {date: 14, day: 4},
        {date: 15, day: 5},
        {date: 16, day: 6},
        {date: 17, day: 7},
        {date: 18, day: 1},
        {date: 19, day: 2},
        {date: 20, day: 3},
        {date: 21, day: 4},
        {date: 22, day: 5},
        {date: 23, day: 6},
        {date: 24, day: 7},
        {date: 25, day: 1},
        {date: 26, day: 2},
        {date: 27, day: 3},
        {date: 28, day: 4},
        {date: 29, day: 5},
        {date: 30, day: 6},
        {day: 7},
      ],
      daysBefore: 3,
      daysAfter: 3,
      daysInMonth: 30,
      ahojclass: 'ahoj',
      neahojclass: 'neahoj',
      weekendCls: 'weekend',
    };
  },
  created() {
    console.log(this.$props.month);
    console.log(this.$props.year);
    console.log(this.$props.data);
  },
};
</script>

<style>

</style>
