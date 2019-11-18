"use strict";

/**
 * Není potřeba, nahrazeno funkcí ajax() v script.js
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * @todo Upravit hardcode, potenciální přepis a optimalizace
   */
  var dataSet = {
    action: 'swp-cal-event',
    year: 2019,
    month: 10,
    security: simpleWPCal.security
  }; // toto by šlo přepsat lépe, ale podle toho můžu backendově filtrovat pouze tento měsíc, opakující se a vícedenní

  var data = "action=".concat(dataSet.action, "&year=").concat(dataSet.year, "&month=").concat(dataSet.month, "&security=").concat(dataSet.security);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", simpleWPCal.ajaxurl, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      var result = xhr.responseText;
      resultCallback(result);
      console.log(result);
    }
  };

  xhr.send(data);
  /**
   * MOCKUP Funkce
   * @param {object} result 
   */

  var resultCallback = function resultCallback(result) {
    var events = JSON.parse(result);
    var thisMonth = "10";
    console.log(JSON.parse(result));
    events.forEach(function (event) {
      var date = event.eventDate.split("-");

      if (date[1] === thisMonth) {
        console.log(date[2]);
        var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(date[2]));
        console.log(elm); // elm.setAttribute("class", "event");

        elm.classList += " event";
      }

      console.log(date);
    });
  }; // return false;

});