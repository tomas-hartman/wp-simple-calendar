<template>
  <div class="weekdays">
    <ul class="swp-cal-weekdays">
      <li :key="weekday" v-for="weekday in weekdays">{{weekday}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WeekdaysHeader',
  data () {
    return {
      weekdays: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    };
  },
};
</script>
