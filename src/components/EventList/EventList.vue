<template>
  <div class="swpc-list">
    <ul>
      <EventItem
        v-for="event in events"
        :key="event.title"
        :event="event"
      />
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import EventItem from './EventItem.vue';
import { getFormatedEventsData } from '@/js/getFormatedEventsData';

export default {
  name: 'EventList',
  components: {
    EventItem,
  },
  data () {
    return {
      events: [],
    };
  },
  async mounted () {
    if (process.env.NODE_ENV !== 'production') {
      const { dataRest } = await import(
        /* webpackChunkName: "chunk-sample-data" */
        '../../samples/data_rest'
      );

      const data = getFormatedEventsData(dataRest, 5, true);
      this.events = data;
      return;
    }

    const { data } = await axios.get('http://wpsc.local/wp-json/swpc/v1/events');

    this.events = getFormatedEventsData(data, 5, true);
  },
};
</script>

<style lang="scss">
@import "./src/style/colors.scss";

.swpc-list {
  --main-width: 322px; // 46 * 7
  --cell-height: 40px;
  --font-size: 18px;
  --item-dimension: calc(2.5em + 16px);
  // --font-size: 1rem;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Open Sans', sans-serif;
  font-size: var(--font-size);
  color: #2c3e50;

  ul {
    padding: 0;
    list-style-type: none;
  }

  &-event {
    height: var(--item-dimension);
    display: flex;

    & + & {
      margin-top: 8px;
    }
  }

  &-event-date + &-event-description {
    margin-left: 8px;
  }

  &-event-date,
  &-event-description {
    display: flex;
    align-items: center;
    height: 100%;
    border-radius: 9px;
  }

  &-event-description {
    background-color: var(--clouded-sky);
    flex: 1;
    line-height: 1.4em;

    &-text {
      padding: 4px 4px 4px 8px;
      max-height: 2.8em; // 2x line-height
      overflow: hidden;
    }
  }
}
</style>
