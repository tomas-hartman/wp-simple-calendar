<template>
  <div class="swpc-month-controller">
      <ul>
        <li class="prev">«</li>
        <li class="next">»</li>
        <li class="month-header">{{month}} {{year}}</li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'MonthController',
  props: {
    month: String,
    year: Number,
  },
};
</script>
