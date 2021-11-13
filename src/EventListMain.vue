<template>
  <EventList :listLength="listLength" />
</template>

<script>
import EventList from './components/EventList/EventList.vue';

const parent = document.querySelector('.swpc-list');
const metaData = parent?.dataset.length;

export default {
  name: 'EventListMain',
  components: {
    EventList,
  },
  data () {
    return {
      listLength: metaData,
    };
  },
};
</script>
