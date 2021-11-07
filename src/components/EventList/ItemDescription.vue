<template>
  <div class="swpc-list-event-description">
      <div
      class="swpc-list-event-category"
        v-if="event.categories.length > 0"
      >
        <div
          class="swpc-list-event-category-item theme-default"
          v-for="category in event.categories"
          v-bind:key="category.slug"
          v-bind:class="[
            `theme-${category.slug}`
          ]"
        />
      </div>
      <div class="swpc-list-event-description-text swpc-list-event-text">
        <a :href="event.permalink">{{event.title}}</a>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ItemDescription',
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

.swpc-list-event {
  &-category {
    height: 100%;
    display: flex;
  }

  &-category-item {
    width: 6px;
    margin: 6px;
    border-radius: 5px;

    & + & {
      margin-left: -2px;
    }
  }

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
