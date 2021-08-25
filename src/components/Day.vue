// @todo

<template>
  <li>{{dayNum}}</li>
</template>

<script>
export default {
  name: 'Day',
  props: {
    dayNum: Number,
  },
  data() {
    return {
      isWeekend: false,
    };
  },
};
</script>
