<template>
  <div class="swpc-list-event-category" v-if="event.categories.length > 0">
    <div
      class="swpc-list-event-category-item theme-default"
      v-for="category in event.categories"
      v-bind:key="category.slug"
      v-bind:class="[`theme-${category.slug}`]"
    >
      <a class="themed-a swpc-list-event-category-description" :href="`category/${category.slug}`" v-bind:class="[`theme-${category.slug}`]">
        {{category.name}}
      </a>
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
.theme-default,
.theme-navy {
  background: var(--navy-light);
  color: var(--clouds-white);
}

.theme-zs {
  background-color: var(--green);
  color: var(--clouds-white);
}

.theme-ms {
  background-color: var(--red);
  color: var(--clouds-white);
}

.theme-sd {
  background-color: var(--orange-light);
  color: var(--black);
}

.theme-skola {
  background-color: var(--blue);
  color: var(--clouds-white);
}

.theme-jidelna,
.theme-purple {
  background-color: var(--purple-light);
  color: var(--clouds-white);
}

.theme-bakalari {
  background-color: aqua; // @todo
  color: var(--clouds-white);
}

a.themed-a {
  text-decoration: none;
}

.swpc-list-event {
  &-category {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    padding: 6px;
  }

  &-category-item {
    border-radius: 5px;
    display: flex;
    overflow: hidden;
    width: 6px;
    max-width: 6px;
    flex-shrink: 0;
    transition: 150ms max-width;

    &:hover {
      width: auto;
      max-width: 100px;
    }

    & + & {
      margin-left: 4px;
    }
  }

  &-category-description {
    right: 100%;
    z-index: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 4px 6px;
    font-size: 0.8em;
    height: 100%;
  }
}
</style>
