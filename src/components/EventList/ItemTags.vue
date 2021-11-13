<template>
  <div
    class="swpc-list-event-category-item theme-default"
    v-for="category in event.categories"
    v-bind:key="category.slug"
    v-bind:class="[
      `theme-${category.slug}`
    ]"
  >
    <div
      class="swpc-list-event-category-description-wrapper"
      v-bind:class="[
        `theme-${category.slug}`
      ]"
    >
      <div class="swpc-list-event-category-description">
        <a class="themed-a" :href="category.slug">{{category.name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemTags',
  props: {
    event: Object,
  },
};
</script>

<style lang="scss">
.swpc-list-event {
  &-category-item {
    width: 6px;
    margin: 6px;
    border-radius: 5px;
    position: relative;

    & + & {
      margin-left: -2px;
    }
  }

  &-category-item:hover &-category-description-wrapper  {
    display: flex;
  }

  &-category-description-wrapper {
    position: absolute;
    height: 100%;
    display: none;
    align-items: center;
    z-index: 100;
    border-radius: 5px;
  }

  &-category-description {
    padding: 4px;
    font-size: 0.8em;
  }
}
</style>
