<template>
    <Calendar />
</template>

<script>
import Calendar from './Calendar/Calendar.vue';

export default {
  name: 'App',
  components: {
    Calendar,
  },
};
</script>

<style lang="scss">
@import "./src/style/colors.scss";

.swpc {
  --main-width: 322px; // 46 * 7
  --cell-height: 40px;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #2c3e50;

  width: var(--main-width);
  margin-top: 5px;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
    margin-left: 0;
  }

  li:not(.swpc-month-controller li):not(.events li) {
    list-style-type: none;
    display: inline-block;
    width: calc(var(--main-width) / 7);
    text-align: center;
    line-height: var(--cell-height);
  }
}

/*
LIST
*/

#swpc-list-main {
  // font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  font-size: 15px;
  margin-top: 5px;
  line-height: 1.4rem;

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    height: 55px;
    margin-bottom: 5px;

    .swp-list-date {
      display: flex;
      width: 55px;
      flex-shrink: 0;
      flex-direction: column;
    }

    .swp-list-title {
      flex-grow: 1;
      flex-shrink: 1;
      display: flex;
    }

    .swp-list-title a {
      text-decoration: none;
      color: black;

      flex-shrink: 1;
      background-color: #bdc3c7;
      box-shadow: 4px 0px #808080, 2px 2px 0px 2px #7F8C8D;
      width: 100%;
      padding: 6px 5px 1px 10px;
      margin-left: 3px;
      transition: 0.05s;
    }

    .swp-list-title a:hover {
      box-shadow: none;
      background-color: #bdc3c7;
      margin-top: 4px;
      margin-left: 7px;
      margin-right: -4px;
      margin-bottom: -2px;
    }

    .swp-list-day-month {
      background-color: #ecf0f1;
      box-shadow: 4px 0px #808080, 2px 2px 0px 2px #7F8C8D;
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      margin-left: -5px;
      margin-right: 5px;
      padding: 3px;
      flex-direction: column;
    }

    .swp-list-year {
      background-color: #9b59b6;
      font-size: small;
      text-align: center;
      margin-left: 5px;
      margin-right: 1px;
      margin-top: 4px;
    }

    .swp-list-year.time {
      background-color: #2c3e4f;
      color: #ecf0f1;
    }
  }
}

span.swp-till {
  line-height: 5px;
}

.truncate-overflow {
  /* Zdrcnutí řádku. Legacy bude bez teček. */

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.swp-list-date-placeholder {
  background-color: #7F8C8D;
  width: 55px;
}

.swp-list-title-placeholder {
  background-color: #7F8C8D;
  width: 100%;
  flex-shrink: 1;
  margin-left: 3px;
}

#validate {
  padding: 0px 10px;
}
</style>
