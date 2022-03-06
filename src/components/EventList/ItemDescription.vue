<template>
  <div class="swpc-list-event-description">
    <ItemTags v-if="event.categories.length > 0" :event="event" />
    <div class="swpc-list-event-description-text swpc-list-event-text">
      <a :href="event.permalink">{{event.title}}</a>
    </div>
  </div>
</template>

<script>
import ItemTags from './ItemTags.vue';

export default {
  name: 'ItemDescription',
  props: {
    event: Object,
  },
  components: {
    ItemTags,
  },
};
</script>

<style lang="scss">
.swpc-list-event {
  &-category + &-description-text {
    padding-left: 4px;
  }

  &-description-text a {
    text-decoration: none;
    color: var(--navy-light);

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
