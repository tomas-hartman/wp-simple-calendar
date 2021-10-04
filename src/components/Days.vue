<template>
  <ul class="days">
    <li
      v-for="day in data"
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
import { sample } from '../samples/data';

export default {
  name: 'Days',
  props: {
    data: Array,
  },
  data () {
    return {
      daysBefore: 3,
      daysAfter: 3,
      daysInMonth: 30,
      ahojclass: 'ahoj',
      neahojclass: 'neahoj',
      weekendCls: 'weekend',
    };
  },
  created () {
    // console.log(this.data);
  },
};
</script>
