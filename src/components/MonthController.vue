<template>
  <div class="swpc-month-controller">
      <ul>
        <li class="prev">«</li>
        <li class="next">»</li>
        <li class="month-header">{{monthName}} {{year}}</li>
      </ul>
    </div>
</template>

<script>
const monthNames = [
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
];

export default {
  name: 'MonthController',
  props: {
    month: Number,
    year: Number,
  },
  data() {
    return {
      monthName: monthNames[this.$props.month],
    };
  },
};
</script>
