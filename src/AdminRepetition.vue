<template>
  <div id="swp-cal-repeat-div" style="padding-top: 1em">
    <label
      for="swp-cal-event-repeat"
      style="width: 100px; display: inline-block"
    >
        Opakovat událost?
      </label>
    <input
      id="swp-cal-event-repeat-chck"
      type="checkbox"
      name="swp-cal-event-repeat"
      value="1"
      v-model="repetitionCheck"
    />
    <div id="swp-cal-repeat-schedule" style="display: inline-block">
      <label
        for="swp-cal-event-repeat-schedule"
        style="width: 100px; display: none"
      >
        Jak často
      </label>
      <select
        id="swp-cal-event-repeat-schedule"
        name="swp-cal-event-repeat-schedule"
        :disabled="!repetitionCheck"
        v-model="selected"
      >
        <option value="1">Týdně</option>
        <option value="2">Měsíčně</option>
        <option value="3">Ročně</option>
      </select>
    </div>
    <span class="note">
      Pozn. pokud má událost výše nastavené "datum konce", událost se po tomto
      datu přestane opakovat.
    </span>
  </div>
</template>

<script>
/**
 * @todo add fetch data from existing event
 */
export default {
  name: 'AdminRepetition',
  data () {
    return {
      repetitionCheck: false,
      selected: '1',
    };
  },
};
</script>

<style lang="scss" scoped>
  .note {
    font-style: italic;
  }
</style>
