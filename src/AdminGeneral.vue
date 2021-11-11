<template>
<div class="swp-cal-general-div">
  <div>
    <label
      for="swp-cal-event-date-end-chck"
      style="width: 100px; display: inline-block;"
      >
      Vícedenní událost
    </label>
    <input
      id="swp-cal-event-date-end-chck"
      type="checkbox"
      name="swp-cal-event-date-end-chck"
      value="1"
      v-model="isMultipleDay"
    />
  </div>
  <div>
    <label for="swp-cal-event-date" style="width: 100px; display: inline-block;">
      Datum události *
    </label>
    <span class="event-date">
      <input
        id="swp-cal-event-date"
        type="text"
        name="swp-cal-event-date"
        placeholder="YYYY-MM-DD"
        :value="eventStart"
      />
    </span>
    <label for="swp-cal-event-date-end">Datum konce události</label>
    <span class="event-end-date">
      <input
        id="swp-cal-event-date-end"
        type="text"
        name="swp-cal-event-date-end"
        placeholder="Jednodenní událost"
        v-model="eventEnd"
        :disabled="!isMultipleDay"
      />
      <!-- TBD -->
    </span>
    <span>Počet dní <span id="swp-cal-event-num-days">{{eventDaysLength}}</span></span>
  </div>
  <div style="padding-top: 1em;">
    <label for="swp-cal-event-time" style="width: 100px; display: inline-block;">
      Čas události
    </label>
    <input
      id="swp-cal-event-time"
      type="text"
      name="swp-cal-event-time"
      placeholder="13:00-14:30, 15:25"
      :value="eventTime"
    />
  </div>
</div>
</template>

<script>
import { formatDate } from './js/helpers';
import { adminGetDaysLength } from './js/admin';

const parent = document.querySelector('.swpc-admin-general');
const metaData = parent?.dataset.meta ? JSON.parse(parent.dataset.meta) : {};

/**
 * @todo add verification
 * @todo use event data if update!
 */
export default {
  name: 'AdminGeneral',
  data () {
    return {
      isMultipleDay: metaData?.eventDays > 1 || false,
      eventDaysLength: metaData.eventDays || 1,
      eventStart: metaData.eventDate || formatDate(new Date()),
      eventEnd: metaData.eventEnd || '',
      eventTime: metaData.eventTime || '',
    };
  },
  watch: {
    isMultipleDay: function () {
      if (this.isMultipleDay) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.eventEnd = formatDate(tomorrow);
        return;
      }

      this.eventEnd = '';
    },
    eventEnd: function () {
      if (!this.eventEnd) {
        this.eventDaysLength = 1;
        return;
      }

      const eventStartDate = new Date(this.eventStart);
      const eventEndDate = new Date(this.eventEnd);

      this.eventDaysLength = adminGetDaysLength(eventStartDate, eventEndDate);
    },
  },
};
</script>

<style></style>
