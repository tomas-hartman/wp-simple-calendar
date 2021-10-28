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

<style lang="scss">
.swpc {
  /* Month header */
  &-month-controller {
    background: #2c3e50;
    text-align: center;
    margin-bottom: 10px;
    height: var(--cell-height);
    line-height: var(--cell-height);
    border-radius: 9px;

    /* Month list */
    ul {
      margin: 0;
      padding: 0;
    }

    li {
      color: white;
      font-size: 18px;
      // width: unset !important;
    }

    /* Previous button inside month header */
    .prev, .next {
      border-radius: 9px;
      cursor: pointer;
      display: block;
      width: var(--cell-height);
      user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .prev {
      float: left;
    }

    /* Next button */
    .next {
      float: right;
    }

    .next:hover,
    .prev:hover {
      background-color: #34495e;
    }
  }
}
</style>
