<template>
  <ul class="events" v-if="events">
    <li class="event" v-for="event in events" :key="event">
      <a :href="event.permalink">
        {{event.title}}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'EventDetail',
  props: {
    events: Array,
  },
};
</script>

<style lang="scss">
  .swpc {
    .events {
      display: none;
      position: absolute;
      // width: 150px;
      z-index: 100;
      background-color: var(--aluminium);
      // width: auto;
      max-width: var(--main-width);
      font-size: 0.85em;
      padding: 0.6rem;
      text-align: left;
      width: 200px;
      padding-left: 1rem;
      color: initial;
    }

    .event {
      line-height: normal;
      width: 100%;
      list-style-type: disc;
      display: block;
    }

    .event + .event {
      margin-top: 0.8rem;
    }

    a {
      text-decoration: none;
      color: black;

    }

    a:hover {
      text-decoration: underline;
    }
  }
</style>
