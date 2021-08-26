<template>
    <Calendar :data="sample" />
</template>

<script>
import Calendar from './components/Calendar.vue';
import {sample} from './samples/data';

export default {
  name: 'App',
  components: {
    Calendar,
  },
  data() {
    return {
      sample,
    };
  },
  // updated() {
  //   console.log(sample);
  // },
};
</script>
