<template>
  <div class="swpc-list-event-date">
    <div v-if="!hasMoreDays" class="swpc-list-event-text">
      <div class="swpc-list-event-text-inner">
      {{readableDate}}
      </div>
    </div>

    <div v-if="hasMoreDays" class="swpc-list-event-text">
      <div class="swpc-list-event-text-inner has-more-days">
      {{readableDate}} - {{readableEndDate}}
      </div>
    </div>

    <div v-if="isDifferentYear" class="swpc-list-event-year">
      <div class="swpc-list-event-year-inner theme-purple">
        2021
      </div>
    </div>

    <div v-if="showTime" class="swpc-list-event-year">
      <div class="swpc-list-event-year-inner theme-navy">
        {{eventTime}}
      </div>
    </div>

  </div>
</template>

<script>
const getShortenedDate = (dateStr) => {
  if (!!dateStr === false) return '';

  const date = new Date(dateStr);

  return `${date.getDate()}.${date.getMonth() + 1}.`;
};

const getShortenedTime = (eventTime) => {
  return eventTime.split('-')[0];
};

export default {
  name: 'ItemDate',
  props: {
    event: Object,
  },
  data () {
    return {
      readableDate: getShortenedDate(this.event.eventDate),
      readableEndDate: getShortenedDate(this.event.eventEnd),
      isDifferentYear: false,
      hasMoreDays: !!this.event.eventEnd && this.event.eventEnd !== '0',
      showTime: !!this.event.eventTime,
      eventTime: getShortenedTime(this.event.eventTime),
    };
  },
};
</script>

<style lang="scss">
.swpc-list-event {
  &-date {
    background-color: var(--clouds-white);
    width: var(--item-dimension);
    justify-content: center;
    flex-direction: column;
  }

  &-date > &-text {
    flex-basis: 100%;
    display: flex;
  }

  &-text-inner {
    align-self: center;
  }

  &-year {
    font-size: 0.7em;
    font-weight: 600;
    width: 100%;
    text-align: center;
  }

  &-year-inner {
    height: 1.4em;
    line-height: 1.4em;
    margin: 0 4px 4px;
    border-radius: 0 0 7px 7px;
  }

  .has-more-days {
    font-size: 0.9rem;
    text-align: center;
    line-height: 1.2em;
  }
}
</style>
