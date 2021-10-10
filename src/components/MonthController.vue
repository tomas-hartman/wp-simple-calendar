<template>
  <div class="swpc-month-controller">
      <ul>
        <li @click="decreaseMonthOffset()" class="prev">«</li>
        <li @click="increaseMonthOffset()" class="next">»</li>
        <li class="month-header">{{monthNames[month]}} {{year}}</li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'MonthController',
  props: {
    month: Number,
    year: Number,
  },
  data () {
    return {
      monthNames: [
        'leden',
        'únor',
        'březen',
        'duben',
        'květen',
        'červen',
        'červenec',
        'srpen',
        'září',
        'říjen',
        'listopad',
        'prosinec',
      ],
    };
  },
  methods: {
    decreaseMonthOffset () {
      this.$emit('decrease-month-offset');
    },
    increaseMonthOffset () {
      this.$emit('increase-month-offset');
    },
  },
};
</script>
