<template>
  <li class="swpc-list-event">
    <ItemDate :event="event" />
    <ItemDescription :event="event" />
  </li>
</template>

<script>
import ItemDescription from './ItemDescription.vue';
import ItemDate from './ItemDate.vue';

export default {
  name: 'EventItem',
  props: {
    event: Object,
  },
  components: {
    ItemDescription,
    ItemDate,
  },
};
</script>

<style lang="scss">
.swpc-list-event {

}
</style>
