<template>
  <div class="swpc">
    <div class="swpc-month-controller">
      <ul>
        <li class="prev">«</li>
        <li class="next">»</li>
        <li class="month-header">srpen 2021</li>
      </ul>
    </div>
    <div class="swpc-body">
      <div class="weekdays">
        <ul id="swp-cal-weekdays">
          <li v-bind:key="weekday" v-for="weekday in weekdays">{{weekday}}</li>
        </ul>
      </div>
      <div class="days"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    msg: String,
  },
  data() {
    return {
      weekdays: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    };
  },
};
</script>
