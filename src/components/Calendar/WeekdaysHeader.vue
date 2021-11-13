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

<style lang="scss">
.swpc {
  /* Weekdays (Mon-Sun) */
  .weekdays {
    margin: 0;
    background-color: var(--concrete);
    border-radius: 9px 9px 0 0;
  }

  .weekdays li:first-of-type {
    border-radius: 9px 0 0 0;
  }

  .weekdays li:last-of-type {
    border-radius: 0 9px 0 0;
  }
}
</style>
