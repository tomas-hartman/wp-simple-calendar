"use strict";

// polyfill
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode === null) {
          return;
        }
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
          callback.call(thisArg, this[i], i, this);
      }
  };
}


swpCal.adminGetCalendar = function (ev) {
  var _this = this;

  var existingDatepicker = document.querySelector(".tooltip .datepicker");

  if (!existingDatepicker
  /**|| !existingDatepicker.contains(ev.target)  element na kterej kliknu není jeho parentem */
  ) {
      var tooltip = this.createTooltip(ev.target.parentElement, 270);
      tooltip.innerText = ev.target.value || "2019-10-12";
      tooltip.classList.add("datepicker");
      var calendarContainer = document.createElement("div");
      calendarContainer.setAttribute("id", "swp-cal-mini-main"); // RESET:

      this.today = new Date(ev.target.value || "2019-10-12");
      this.getMonths(0);
      this.getCalendar(); // uloží se do swpCal.mainDiv, někdy se přidávaly další elementy - opraveno

      calendarContainer.appendChild(this.mainElm);
      tooltip.appendChild(calendarContainer); // přidám ho do bubliny

      ev.target.parentElement.appendChild(tooltip); // --> musím si předat do samostatné funkce

      /**
       * Autoclose
       * @todo safari si s tím prý nerozumí
       */

      document.onclick = function (innerEv) {
        var datepicker = document.querySelector(".tooltip .datepicker");

        if (datepicker && datepicker.parentNode && !datepicker.parentNode.contains(innerEv.target)) {
          _this.resetDatepicker(datepicker);
        } // Zde může být bug při případné úpravě css pro ul.days


        var ulDays = document.querySelector("#swp-cal-mini-main ul.days");

        if (datepicker && ulDays && ulDays.contains(innerEv.target) && innerEv.target.nodeName === "SPAN" && innerEv.target.innerText !== "") {
          var day = innerEv.target.innerText;
          var date = new Date(_this.firstDayOfMonth.getFullYear(), _this.firstDayOfMonth.getMonth(), day);

          var dateString = _this.getDateString(date);

          datepicker.previousElementSibling.value = dateString;

          _this.adminGetNumDays();

          _this.resetDatepicker(datepicker);
        } // pokud kliknu na element, jehož parent je ul.days nebo je sám .swp-cal-day

      };
    }
};

swpCal.resetDatepicker = function (datepicker) {
  // RESET a Autoclose:
  datepicker.parentNode.classList.remove("tooltip");
  datepicker.parentNode.classList.remove("event");
  datepicker.remove();
  this.relMonth = 0;
  this.mainElm = document.createElement("div");
};

swpCal.adminGetNumDays = function () {
  // console.log(document.querySelector("#swp-cal-event-date-end").disabled);
  if (document.querySelector("#swp-cal-event-date-end").disabled) return;
  var numOfDaysElm = document.querySelector("#swp-cal-event-num-days");
  var eventStartElement = document.querySelector("#swp-cal-event-date");
  var eventEndElement = document.querySelector("#swp-cal-event-date-end");
  var diff = new Date(eventEndElement.value) - new Date(eventStartElement.value);
  var yearMs = 24 * 60 * 60 * 1000;
  var daysOffset = Math.floor(diff / yearMs) + 1; // rozdíl ve dnech - rozbíjelo by týdenní rozestupy

  numOfDaysElm.innerText = daysOffset;
};
/**
 * @todo Rozpracovat víc, co chci, platné by mělo být:
 * - 10.1.2019  !! 1. října
 * - 1.6.2019   !! 6. ledna
 * - 2019-6-1      1. června
 * - 2019-12-24    24. prosince
 * - 24.12.2019 !! Invalid date
 * 
 * - 2019-02-31 !! 3. března
 * - a ostatní, stringy spod.
 * 
 * 10.1.2019#1.6.2019#2019-6-1#2019-12-24#2019-02-31#24.12.2019
 * 
 * Pomocí regexu!
 * 
 * Zatím testuje pouze, jestli tam nebylo vyloženě neplatné datum, string apod.
 * 
 * @todo Vyřešit případ __31.2.2019__!
 */


swpCal.handleInputDate = function (value) {
  var regex1 = /(\d{4}-((10|11|12)|(([0]\d)|\d{1})))-(3[0-5]|[0-2]\d|\b[1-9]\b)/g; // 2019-12-05

  var regex2 = /(3[0-5]|[0-2]\d|\b[1-9]\b).\s?((10|11|12)|(([0]\d)|\d{1})).\s?(\d{4})/g; // 12.6.2016

  var format = this.calFormat;
  var output = new Date(value);

  if (value.match(regex1)) {
    // pracuj s 2019-12-15
    value = value.split("-");
    var lastDayOfMonth = new Date(parseInt(value[0]), parseInt(value[1]), 0);
    var dayFromValue = new Date(parseInt(value[0]), parseInt(value[1])-1, parseInt(value[2]));

    if (dayFromValue > lastDayOfMonth) {
      return this.getDateString(lastDayOfMonth);
    }

    return this.getDateString(value.toString());
  } else if (value.match(regex2)) {
    // pracuj s 6.12.2019 a zjisti, jestli je to 6. prosince (cs) nebo 12. června (us)
    value = value.replace(/\s/g, "");
    value = value.split(".");
    var _lastDayOfMonth = "";
    var _dayFromValue = "";

    if (format === "cs") {
      _lastDayOfMonth = new Date(parseInt(value[2]), parseInt(value[1]), 0);
      _dayFromValue = new Date(parseInt(value[2]), parseInt(value[1])-1, parseInt(value[0]));
    } else {
      console.warn("handleInputDate: format !== CS, date output handled as US");
      _lastDayOfMonth = new Date(parseInt(value[2]), parseInt(value[0]), 0);
      _dayFromValue = new Date(parseInt(value[2]), parseInt(value[0])-1, parseInt(value[1]));
    }

    if (_dayFromValue > _lastDayOfMonth) {
      return this.getDateString(_lastDayOfMonth);
    }

    return this.getDateString(_dayFromValue);
  } else if (output instanceof Date && !isNaN(output.valueOf())) {
    // tuhle podmínku promyslet, může jít o americké datum nebo tak něco
    return value;
  } else return this.getDateString(this.todayNorm); // když nic neklapne, je špatný datum a patří tam dnešní datum    

};
/**
 * @todo refaktor!
 * @param {MouseEvent} ev 
 */


swpCal.handleAdminEvents = function (ev) {
  var _this2 = this;

  switch (ev.target.getAttribute("id")) {
    case "swp-cal-event-date":
      this.adminGetCalendar(ev);
      ev.target.addEventListener("focusout", function (ev) {
        ev.target.value = _this2.handleInputDate(ev.target.value);

        _this2.adminGetNumDays();
      }, {
        once: true
      });
      break;

    case "swp-cal-event-date-end":
      if (document.querySelector("#swp-cal-event-date-end").disabled) break;
      this.adminGetCalendar(ev);
      ev.target.addEventListener("focusout", function (ev) {
        ev.target.value = _this2.handleInputDate(ev.target.value);

        _this2.adminGetNumDays();
      }, {
        once: true
      });
      break;

    case "swp-cal-event-time":
      console.log(ev.target.value);
      break;

    case "swp-cal-event-date-end-chck":
      // console.log(ev.target.checked);
      var eventEndElement = document.querySelector("#swp-cal-event-date-end");
      var eventStartElement = document.querySelector("#swp-cal-event-date");
      var numOfDaysElm = document.querySelector("#swp-cal-event-num-days");

      if (ev.target.checked) {
        var newDate = new Date(eventStartElement.value);
        var initialDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        var valueDate = this.getDateString(initialDate);
        eventEndElement.disabled = false;
        eventEndElement.value = valueDate;
        numOfDaysElm.innerText = 2;
      } else {
        eventEndElement.disabled = true;
        eventEndElement.value = "";
        numOfDaysElm.innerText = 1;
      }

      break;

    case "swp-cal-event-repeat-chck":
      var select = document.querySelector("#swp-cal-event-repeat-schedule");

      if (ev.target.checked) {
        select.disabled = false;
      } else select.disabled = true;

      break;

    default:
      // console.log("klikls mimo");
      break;
  } // console.log(ev);

};
/**
 * @todo Upravit, aby se nerenderovalo x-krát, možná upravit, aby se vytvářelo přes PHP
 */


swpCal.adminValidationErr = function (text, origin) {
  var renderFrame = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var placeholder = document.querySelector(".wp-header-end");
  var messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.classList.add("notice", "notice-error", "is-dismissible", "validation-error");
  var errorMsgUl = document.createElement("ul");
  var errorMsg = document.createElement("li");
  errorMsg.classList.add("error");
  errorMsg.innerText = text;
  errorMsgUl.appendChild(errorMsg);
  messageDiv.appendChild(errorMsgUl);
  placeholder.parentNode.insertBefore(messageDiv, placeholder.nextSibling);
  if (!renderFrame) return;
  origin.style.borderColor = "#a00";
  origin.style.backgroundColor = "rgba(170, 0, 0, 0.1)";
};

swpCal.adminValidate = function (el) {
  var eventEndElement = document.querySelector("#swp-cal-event-date-end");
  var eventStartElement = document.querySelector("#swp-cal-event-date");
  var numOfDaysElm = document.querySelector("#swp-cal-event-num-days");
  var hoursElement = document.querySelector("#swp-cal-event-time");
  var titleElement = document.getElementsByName("post_title")[0];
  var validateErrors = document.querySelectorAll(".notice.validation-error");
  validateErrors.forEach(function (notice) {
    notice.remove();
  });
  var regexYear = /(\d{4}-(0\d|(10|11|12))-(0[1-9]|[1-2]\d|(30|31)))|(^$)/g;
  var regexHour = /((\D\d|1\d|2[0-3]):[0-5]\d-(\d{1}|1\d|2[0-3]):[0-5]\d|(\D\d|1\d|2[0-3]):[0-5]\d)|(^$)/g;

  if (titleElement.value.trim() === "") {
    var text = "Vyplňte název události.";
    this.adminValidationErr(text, titleElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!eventStartElement.value.match(regexYear)) {
    var _text = "Datum události je ve špatném formátu. Napište datum ve formátu 2019-11-04 nebo jej vyberte z kalendáře.";
    this.adminValidationErr(_text, eventStartElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!eventEndElement.disabled && !eventEndElement.value.match(regexYear)) {
    var _text2 = "Datum konce události je ve špatném formátu. Napište datum ve formátu 2019-11-04 nebo jej vyberte z kalendáře.";
    this.adminValidationErr(_text2, eventEndElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (numOfDaysElm.innerText === "NaN" || parseInt(numOfDaysElm.innerText) < 1) {
    if (document.querySelector("#swp-cal-event-date-end-chck").checked && parseInt(numOfDaysElm.innerText) <= 1) {
      var _text3 = "Počet dní je neplatný. Vícedenní událost nemůže končit v minulosti ani ve stejný den, kdy začala.";
      this.adminValidationErr(_text3, numOfDaysElm, false);
    } else {
      var _text4 = "Počet dní je neplatný. Zkontrolujte formát data události.";
      this.adminValidationErr(_text4, numOfDaysElm, false);
    }

    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }

  if (!hoursElement.value === "" || !hoursElement.value.match(regexHour)) {
    var _text5 = "Čas události je ve špatném formátu. Zadejte čas ve formátu 8:45, 18:00 nebo rozmezí 12:30-13:10.";
    this.adminValidationErr(_text5, hoursElement);
    el.preventDefault ? el.preventDefault() : el.returnValue = false;
  }
}; // Pokud jsem v admin módu, vykoná se toto


if (swpCal.anchorAdminMetabox) {
  swpCal.anchorAdminMetabox.parentNode.onclick = function (ev) {
    swpCal.handleAdminEvents(ev);
  };

  document.querySelector("#publish").addEventListener("click", function (el) {
    swpCal.adminValidate(el);
  });
}