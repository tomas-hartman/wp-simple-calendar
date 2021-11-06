<template>
    <Calendar />
</template>

<script>
import Calendar from './components/Calendar.vue';

export default {
  name: 'App',
  components: {
    Calendar,
  },
  // updated() {
  //   console.log(sample);
  // },
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

// .swpc {

// /* Days (1-31) */
// .days {
//   padding: 0;
//   /* background: #bdc3c7; */
//   margin: 0;
//   cursor: default;
// }

// .weekdays li,
// .days li,
// .day-events #swp-cal-mini-main li {
//   list-style-type: none;
//   display: inline-block;
//   width: calc(var(--main-width) / 7);
//   text-align: center;
//   line-height: var(--cell-height);
// }

// .day-events #swp-cal-mini-main li {
//   padding: 0;
//   margin: 0;
//   color: black;
// }

// .day-events #swp-cal-mini-main .month li {
//   color: #fff;
// }

// .day-events #swp-cal-mini-main .month li.month-header {
//   width: auto;
// }

// /* Highlight the "current" day */
// .days li .active {
//   background: #2c3e50;
//   color: #bdc3c7 !important;
//   display: block;
// }

// .datepicker .days {
//   background: #bdc3c7;
// }

// .datepicker .days li>span:hover {
//   background-color: rgba(44, 62, 80, 0.220);
//   cursor: pointer;
// }

// .tooltip {
//   position: relative;
//   display: inline-block;
// }

// .tooltip .day-events {
//   visibility: hidden;
//   width: 120px;
//   background-color: #23282d;
//   color: #fff;
//   text-align: center;

//   top: 100%;
//   left: 50%;
//   margin-left: -60px;
//   /* Use half of the width (120/2 = 60), to center the tooltip */

//   padding: 5px 0;
//   border-radius: 6px;

//   /* Position the tooltip text - see examples below! */
//   position: absolute;
//   z-index: 1;
// }

// .tooltip:hover .day-events {
//   visibility: visible;
// }

// .tooltip .day-events::after {
//   content: " ";
//   position: absolute;
//   bottom: 100%;
//   /* At the bottom of the tooltip */
//   left: 50%;
//   margin-left: -5px;
//   border-width: 5px;
//   border-style: solid;
//   color: #6b3483;
//   border-color: transparent transparent black transparent;
// }

// .tooltip .day-events a {
//   color: #bdc3c7;
//   text-decoration: none;
// }

// .tooltip .day-events a:hover {
//   text-decoration: underline;
// }

// .day-events li {
//   width: auto;
//   text-align: left;
//   padding: 0 10px;
//   line-height: normal;
// }

/* .day-events #swp-cal-mini-main li {
  padding: auto;
  text-align: center;
  width
} */
// }

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
