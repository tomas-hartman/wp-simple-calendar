"use strict";

var swpCal = {
  weekdayNames: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
  monthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
  anchorMiniCal: document.getElementById("swp-cal-mini-main"),
  anchorList: document.getElementById("swp-cal-list-main"),
  anchorAdminMetabox: document.getElementById("swp-cal-metabox"),
  mainElm: document.createElement("div"),
  daysElm: document.createElement("ul"),
  today: new Date(),
  relMonth: 0,
  firstDayOfMonth: "",
  firstDayOfNextMonth: "",
  numOfDays: "",
  daysArr: [],
  displayedMonth: "",
  listRendered: false,
  listNumEvents: 5,

  /**
   * Helper funkce. Nastavuje základní proměnné pro jednotlivé funkce podle relativního měsíce.
   * @access init, refreshData()
   * @param {number} relMonth Konstanta s relativním počtem měsíců vůči dnešku
   * @var firstDayOfMonth První den daného měsíce
   * @var firstDayOfNextMonth První den následujícího měsíce
   * @var numOfDays Počet dní v měsíci
   * @var daysArr Pomocné pole s daty jednotlivých dnů v měsíci 
   */
  getMonths: function getMonths(relMonth) {
    this.firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + relMonth);
    this.firstDayOfNextMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1);
    this.lastDayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1, 0);
    this.lastDayOfPrevMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), 0);
    this.displayedMonth = this.firstDayOfMonth.getMonth() + 1;
    this.numOfDays = Math.floor((this.firstDayOfNextMonth - this.firstDayOfMonth) / (1000 * 60 * 60 * 24)); // při přeměně času na zimní může mít jiný počet hodin @todo je správně floor?!

    this.daysArr = [];

    for (var i = 1; i <= this.numOfDays; i++) {
      this.daysArr.push(i);
    }
  },
  createHeaderWeekdays: function createHeaderWeekdays() {
    // if(this.mainElm.querySelector("#swp-cal-weekdays")) return null;
    var ulWeekdays = document.createElement("ul");
    ulWeekdays.setAttribute("class", "weekdays");
    ulWeekdays.setAttribute("id", "swp-cal-weekdays");

    for (var i = 0; i < 7; i++) {
      var elm = document.createElement("li");
      elm.innerText = this.weekdayNames[i];
      ulWeekdays.appendChild(elm);
    }

    return ulWeekdays;
  },

  /**
   * Pomocná funkce pro createHeaderMonth()
   * @access refreshData() a init generování kalendáře
   * @param {Date} firstDayOfMonth 
   */
  createMonthTitle: function createMonthTitle(firstDayOfMonth) {
    var month = this.monthNames[firstDayOfMonth.getMonth()];
    var year = firstDayOfMonth.getFullYear();
    return "".concat(month, " ").concat(year);
  },
  createHeaderMonth: function createHeaderMonth() {
    var divMonth = document.createElement("div");
    divMonth.setAttribute("class", "month");
    divMonth.innerHTML = "\n            <ul>\n                <li class=\"prev\">\xAB</li>\n                <li class=\"next\">\xBB</li>\n                <li class=\"month-header\">".concat(this.createMonthTitle(this.firstDayOfMonth), "</li>\n            </ul>\n        ");
    return divMonth;
  },

  /**
   * Pomocná funkce pro getWeeks() - nevolat samostatně!
   * Vytvoří mi elementy pro jednotlivé dny, včetně popisků a zvýraznění
   * @param {number} date číslo dne z kalendáře
   * @param {*} params Parametry k jednotlivým dnům, zejména popisky událostí
   * @todo
   */
  createElm: function createElm(originDate, params) {
    var elm = document.createElement("li");
    var span = document.createElement("span");
    var date = originDate; // Chci, aby datum v classe bylo ve formátu 05, 06 apod.

    if (typeof date !== "undefined" && date < 10) {
      date = "0".concat(originDate); // console.log(date);
    }

    if (this.firstDayOfMonth.getMonth() === this.today.getMonth() && originDate === this.today.getDate()) {
      // const todayElm = document.createElement("span");
      span.setAttribute("class", "active");
      span.setAttribute("id", "day-".concat(date));
      span.innerText = originDate;
      elm.appendChild(span);
      return elm;
    }

    if (date) {
      span.innerText = originDate;
      span.setAttribute("id", "day-".concat(date));
      elm.appendChild(span);
    }

    if (params) {// elm.appendChild(document.createElement("span"));
      // add more
    }

    return elm;
  },
  createTooltip: function createTooltip(elm) {
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // width: 270px;
    // margin-left: calc(-270px/2);
    var span = document.createElement("span");
    span.classList.add("day-events");
    elm.classList.add("event");
    elm.classList.add("tooltip");

    if (width) {
      var style = "width: ".concat(width, "px; margin-left: calc(-").concat(width, "px/2); visibility: visible;");
      span.setAttribute("style", style);
    }

    return span;
  },

  /**
   * @param {object} event Událost, kterou budu připojovat
   * @param {DOM Element} elm Elm v kalendáři se dnem ke kterému budu novou událost připojovat
   * @todo opravit bug 2.11. --> po dvojkliku se zdvojí "Opakující se vícedenní akce"
   * @returns Vytvoří HTML pro event a připojí ho k elm   
   */
  createEventElm: function createEventElm(event, elm) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", event.permalink);
    a.innerText = event.title;
    li.appendChild(a);
    var checkElm = elm.querySelector(".day-events ul");
    var checkHref = elm.querySelector("a[href='".concat(event.permalink, "']"));

    if (checkElm && !checkHref) {
      checkElm.appendChild(li);
    } else {
      var span = this.createTooltip(elm); // const span = document.createElement("span");

      var ul = document.createElement("ul"); // span.classList.add("day-events");

      ul.appendChild(li);
      span.appendChild(ul); // elm.classList.add("event");
      // elm.classList.add("tooltip");

      elm.appendChild(span);
    }
  },

  /**
   * Funkce, která vrací kopii objektu s upraveným datem konání
   * Vkládá se do objektu pro vytváření nadcházejících událostí
   * @param {object} event 
   * @param {Date} date 
   */
  createEventForList: function createEventForList(event, date, dateEnd) {
    var eventCopy = JSON.parse(JSON.stringify(event)); // ohack na kopii objektu

    eventCopy.eventDate = this.getDateString(date);
    if (dateEnd) eventCopy.eventEndDate = this.getDateString(dateEnd);
    return eventCopy;
  },

  /**
   * Hlavní funkce
   * Vygeneruje strukturu kalendáře pro jednotlivé dny
   * @returns DOM s vytvořenými elementy pro jednotlivé dny
   * @access main generování kalendáře a refreshData()
   */
  getWeeks: function getWeeks() {
    var days = document.createElement("ul");
    days.setAttribute("class", "days");
    var firstWeekConst = false;
    var firstDay = this.firstDayOfMonth.getDay();

    if (firstDay === 0) {
      firstDay = 7;
    }

    while (this.daysArr.length > 0) {
      for (var i = 1; i < 8; i++) {
        if (i >= firstDay && !firstWeekConst) {
          // Případ, kdy měsíc začíná o víkendu
          var daysArrItem = this.daysArr.shift();
          var dayElm = this.createElm(daysArrItem);
          if (i === 6 || i === 7) dayElm.classList.add("weekend");
          firstWeekConst = true;
          days.appendChild(dayElm); // RENDER FULL

          continue;
        }

        if (firstWeekConst && this.daysArr.length > 0) {
          var _daysArrItem = this.daysArr.shift();

          var _dayElm = this.createElm(_daysArrItem);

          if (i === 6 || i === 7) _dayElm.classList.add("weekend");
          days.appendChild(_dayElm); // RENDER FULL

          continue;
        }

        days.appendChild(this.createElm()); // RENDER EMPTY          
      }
    }

    return days;
  },

  /**
   * Konvertuje datum na date string, který používám v event.eventDate
   * @todo uplatnit na více místech, kde to potřebuju; možná nikde
   * @param {Date} date 
   */
  getDateString: function getDateString(date) {
    var newDate = new Date(date);
    var dayString = newDate.getDate().toString();
    var monthString = (newDate.getMonth() + 1).toString();

    if (dayString.length === 1) {
      dayString = "0".concat(dayString);
    }

    ;

    if (monthString.length === 1) {
      monthString = "0".concat(monthString);
    }

    ;
    var dateString = "".concat(newDate.getFullYear(), "-").concat(monthString, "-").concat(dayString);
    return dateString;
  },
  // Posouvání v kalendáři dopředu a dozadu a jeho refreshe //  
  refreshData: function refreshData(relMonth) {
    var monthHeader = document.querySelector("#calendar li.month-header");
    this.getMonths(relMonth);
    monthHeader.innerHTML = this.createMonthTitle(this.firstDayOfMonth);
    var elm = this.mainElm.querySelector("ul.days");
    elm.parentNode.removeChild(elm);
    this.mainElm.appendChild(this.getWeeks());
  },
  fcnNext: function fcnNext() {
    this.relMonth += 1;
    this.refreshData(this.relMonth);
  },
  fcnPrev: function fcnPrev() {
    this.relMonth -= 1;
    this.refreshData(this.relMonth);
  },
  addEventOneDay: function addEventOneDay(event) {
    var date = event.eventDate.split("-");
    var thisMonth = this.firstDayOfMonth.getMonth() + 1;
    var thisYear = this.firstDayOfMonth.getFullYear();

    if (parseInt(date[1]) === thisMonth && parseInt(date[0]) === thisYear) {
      var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(date[2]));
      this.createEventElm(event, elm);
    }
  },
  addEventMultipleDays: function addEventMultipleDays(event, thisMonthStr) {
    /**
     * Dva edge casy: událost, která trvá do dalšího měsíce DONE
     * událost, která pokračuje z minulého měsíce DONE
     * potenciální víceměsíční akce! @todo
     */
    var date = event.eventDate.split("-");
    var thisMonth = this.firstDayOfMonth.getMonth() + 1;
    var thisYear = this.firstDayOfMonth.getFullYear();
    var numOfDays = this.lastDayOfMonth.getDate();
    var eventEndDate = parseInt(date[2]) + parseInt(event.eventDays);
    var lastDayOfPrevMonth = this.lastDayOfPrevMonth.getDate(); // case 1 - tento měsíc

    if (parseInt(date[1]) === thisMonth && parseInt(date[0]) === thisYear) {
      for (var i = 0; i < event.eventDays; i++) {
        var idDate = parseInt(date[2]) + i;

        if (idDate <= numOfDays) {
          idDate = idDate.toString();

          if (idDate.length < 2) {
            idDate = "0".concat(idDate);
          }

          ;
          var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(idDate));
          this.createEventElm(event, elm);
        }
      }
    } // case 2 akce z minulého měsíce: začíná minulý měsíc a zároveň jeho datumStartu + početDní je větší, než počet dní toho měsíce
    else if (parseInt(date[1]) === thisMonth - 1 && eventEndDate > lastDayOfPrevMonth) {
        var diff = eventEndDate - lastDayOfPrevMonth;

        for (var _i = 1; _i < diff; _i++) {
          var _idDate = _i.toString();

          if (_idDate.length < 2) {
            _idDate = "0".concat(_idDate);
          }

          ;

          var _elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(_idDate));

          this.createEventElm(event, _elm);
        }
      }
  },
  addEventRepeated: function addEventRepeated(event) {
    var thisMonth = this.firstDayOfMonth.getMonth() + 1;
    var date = event.eventDate.split("-");
    /**
     * Check periodicity of repetition: 0 = none; 1 = weekly; 2 = monthly; 3 = yearly
     * 
     * Check month -> show.
     */

    switch (parseInt(event.eventRepeat)) {
      case 1:
        addRepeatedWeekly();
        break;

      case 2:
        addRepeatedMonthly();
        break;

      case 3:
        addRepeatedYearly();
        break;

      default:
        console.log("Error. Something went wrong.");
        break;
    }

    function addRepeatedYearly() {
      if (parseInt(date[1]) === thisMonth) {
        var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(date[2]));
        swpCal.createEventElm(event, elm);
      }
    }

    function addRepeatedMonthly() {
      var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(date[2]));
      swpCal.createEventElm(event, elm);
    }
    /**
     * @todo Upravit, aby se nezobrazovalo před prvním datem opakování
     */


    function addRepeatedWeekly() {
      /**
       * 2019-10-14 => pondělí, akce se bude opakovat každé pondělí. Pondělí je tedy 2019-10-14 + 7*n (1)
       * další měsíc:
       * 1. najdi pondělí.
       * -- 1. den měsíce - úterý (tzn. 2)
       *    1. pondělí v měcíci
       *      úterý(2) - pondělí(den 1 + 7 dní (další týden - protože je větší)) = 6 (korekce je tedy 6)
       */
      var firstDate = new Date(event.eventDate);
      var eventDay = firstDate.getDay(); // den v měsíci, kdy se akce koná

      var monthDayOfWeek = swpCal.firstDayOfMonth.getDay(); // první den daného měsíce

      var diff;

      if (eventDay < monthDayOfWeek) {
        diff = eventDay + 7 - monthDayOfWeek;
      } else {
        diff = eventDay - monthDayOfWeek;
      }

      var eventStartDate = diff + 1; // tento den se akce koná v tomto měsíci poprvé; všechny další event days jsou toto + 7

      while (eventStartDate <= swpCal.lastDayOfMonth.getDate()) {
        var str = eventStartDate.toString();

        if (str.length < 2) {
          str = "0".concat(str);
        }

        var elm = document.querySelector("#swp-cal-mini-main #calendar .days #day-".concat(str));
        swpCal.createEventElm(event, elm);
        eventStartDate = eventStartDate + 7;
      }
    }
  },

  /**
   * Renders placeholder for events list
   * @param {number} size 
   */
  getListPlaceholder: function getListPlaceholder(size) {
    var ulElm = document.createElement("ul");
    ulElm.classList.add("swp-list");

    for (var i = 0; i < size; i++) {
      var liElm = document.createElement("li");
      var divDate = document.createElement("div");
      var divTitle = document.createElement("div");
      liElm.classList.add("swp-upcoming-event-".concat(i));
      divDate.classList.add("swp-list-date-placeholder");
      divTitle.classList.add("swp-list-title-placeholder");
      liElm.appendChild(divDate);
      liElm.appendChild(divTitle);
      ulElm.appendChild(liElm);
    }

    this.anchorList.appendChild(ulElm);
  },

  /**
   * 
   * @param {array} events výsledek XHR requestu
   * @param {number} size počet dní, pro které chci akci vykreslit -> tolikrát se maximálně může za sebou událost zobrazit
   */
  renderList: function renderList(events, size) {
    // @todo pokud mám nastávajících událostí míň, než je size, pak vykreslit správně! 
    var container = document.createElement("ul");
    container.classList.add("swp-list");
    var upcomingEvents = [];
    this.listRendered = true;
    /**
     * Pole s akcemi
     */

    for (var i = 0; i < events.length; i++) {
      var repeatMode = parseInt(events[i].eventRepeat);
      var daysLen = parseInt(events[i].eventDays);
      var eventStartDate = new Date(events[i].eventDate);
      var eventEndDate = "";

      if (events[i].eventEnd && events[i].eventEnd !== "0") {
        eventEndDate = new Date(events[i].eventEnd);
      } else {
        eventEndDate = new Date(events[i].eventDate); // eventEndDate.setHours(eventEndDate.getHours() + daysLen * 24);

        eventEndDate.setDate(eventEndDate.getDate() + (daysLen - 1));
      } // 1. obyč nadcházející jednorázové akce


      if (eventStartDate >= this.today && repeatMode === 0 && daysLen === 1) {
        upcomingEvents.push(events[i]);
      } // 2. vícedenní akce @todo vícedenní opakované akce!
      // dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
      else if (daysLen > 1 && (eventStartDate >= this.today || eventEndDate >= this.today)) {
          // případ kdy akce končí po dnešku, ale začíná někdy dříve - i ty potřebuju použít
          if (eventStartDate < this.today && eventEndDate >= this.today) {
            upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
            continue;
          } // standardní případ, kdy akce začíná v budoucnosti


          upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
        } // 3. opakující se akce

        /**
         * @todo case 2 a case 3 jsou úplně totožné, rozdíl je v tom, že u jednoho se přičítá jednička ke dni, u druhého k roku
         * @todo case 1 je kromě offsetu v případě prvního výskytu hodně blízký dalším casům
         */
        else if (repeatMode > 0) {
            switch (repeatMode) {
              case 1:
                // týdně

                /**
                 * budu checkovat v jakej den se koná a přidám 'size' jejich instancí po datu today
                 * @todo this.relmonth bude dělat chyby v tomhle případě!
                 */
                var dayOfWeeklyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());

                for (var n = 0; n < size; n++) {
                  if (dayOfWeeklyEvent >= this.today) {
                    upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                  } else {
                    // tady to je potřeba opravit o rozdíl mezi prvním dnem v týdnu/akce 
                    var diff = this.today - dayOfWeeklyEvent;
                    var yearMs = 24 * 60 * 60 * 1000;
                    var daysOffset = Math.floor(diff / yearMs); // rozdíl ve dnech - rozbíjelo by týdenní rozestupy

                    var weeksOffset = Math.ceil(daysOffset / 7); // rozdíl v týdnech - ten potřebuju, abych zachoval týdenní rozestupy

                    dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7 * weeksOffset);
                    upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                  }

                  dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7);
                }

                break;

              case 2:
                // měsíční akce
                var dayOfEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());

                for (var _n = 0; _n < size; _n++) {
                  if (dayOfEvent >= this.today) {
                    upcomingEvents.push(this.createEventForList(events[i], dayOfEvent));
                  } else {
                    dayOfEvent = new Date(dayOfEvent.getFullYear(), dayOfEvent.getMonth() + 1, dayOfEvent.getDate());
                    upcomingEvents.push(this.createEventForList(events[i], dayOfEvent));
                  }

                  dayOfEvent = new Date(dayOfEvent.getFullYear(), dayOfEvent.getMonth() + 1, dayOfEvent.getDate());
                }

                break;

              case 3:
                // roční akce
                var dayOfYearlyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());

                for (var _n2 = 0; _n2 < size; _n2++) {
                  if (dayOfYearlyEvent >= this.today) {
                    upcomingEvents.push(this.createEventForList(events[i], dayOfYearlyEvent));
                  } else {
                    dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                    upcomingEvents.push(this.createEventForList(events[i], dayOfYearlyEvent));
                  }

                  dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                }

                break;

              default:
                console.log("event repeatMode not standard: ".concat(repeatMode));
                break;
            }
          }
    }

    upcomingEvents.sort(function (b, a) {
      return new Date(b.eventDate) - new Date(a.eventDate);
    }); // console.log("allover:");
    // console.log(upcomingEvents);

    /**
     * Renderování polí
     */

    var isContainer = document.querySelector("ul.swp-list") ? true : false;
    if (isContainer) container = document.querySelector("ul.swp-list");

    for (var y = 0; y < size; y++) {
      var eventElm = this.createListItem(upcomingEvents[y], y);

      if (isContainer) {
        var cont = document.querySelector("ul.swp-list .swp-upcoming-event-".concat(y));
        cont.parentNode.removeChild(cont);
      }

      container.appendChild(eventElm); // container.innerHTML += upcomingEvents[y].title;
      // container.innerHTML += "<br>";
    }

    this.anchorList.appendChild(container);
  },

  /**
   * Vytvoří DOM Node s jednou položkou do listu
   * @param {object} event Objekt s událostí
   * @param {number} iter číslo eventu
   * 
   * @example Struktura Nodu
   * <li class="swp-upcoming-event-1">
   *     <div class="swp-list-date">
   *         <span class="swp-list-day-month">29. 10.</span>
   *         <span class="swp-list-year">2019</span>
   *     </div>
   *     <div class="swp-list-title">
   *         <a href="https://www.skolahradecns.cz/event/podzimni-prazdniny-2/">Podzimní prázdniny</a>
   *     </div>
   * </li>
   */
  createListItem: function createListItem(event, iter) {
    console.log(event);
    var date = event.eventDate.split("-");
    var year = date[0];
    var yearFits = this.today.getFullYear() === parseInt(year) ? true : false;
    var eventTime = event.eventTime || null;
    var dayMonth = "";
    var eventTimeToDisplay = "";
    console.log(eventTime);

    if (eventTime) {
      eventTimeToDisplay = eventTime.split("-")[0];
    }

    if (parseInt(event.eventDays) > 1 && typeof event.eventEndDate !== 'undefined') {
      var dateEnd = event.eventEndDate.split("-");
      dayMonth = "".concat(parseInt(date[2]), ". ").concat(parseInt(date[1]), ". \n                        <span class=\"swp-till\">&#8208;</span> \n                        ").concat(parseInt(dateEnd[2]), ". ").concat(parseInt(dateEnd[1]), ".");
    } else dayMonth = "".concat(parseInt(date[2]), ". ").concat(parseInt(date[1]), ".");

    var li = document.createElement("li");
    var div = document.createElement("div");
    var spanDate = document.createElement("span");
    var spanYear = document.createElement("span");
    var divEvent = document.createElement("div");
    var aElm = document.createElement("a");
    li.classList.add("swp-upcoming-event-".concat(iter));
    div.classList.add("swp-list-date");
    spanDate.classList.add('swp-list-day-month');
    spanDate.innerHTML = dayMonth;
    spanYear.classList.add('swp-list-year');
    divEvent.classList.add("swp-list-title");
    aElm.setAttribute("href", event.permalink);
    aElm.innerText = event.title;
    div.appendChild(spanDate);

    if (eventTime && parseInt(event.eventDays) === 1) {
      spanYear.classList.add("time");
      spanYear.innerText = eventTimeToDisplay;
      div.appendChild(spanYear);
    } else if (!yearFits) {
      spanYear.innerText = year;
      div.appendChild(spanYear);
    } // div.appendChild(spanYear);


    divEvent.appendChild(aElm);
    li.appendChild(div);
    li.appendChild(divEvent);
    return li;
  },

  /**
   * @todo zbytečně nepřidávat podruhé ty listenery
   * @todo možná půjde odstranit oprava proti zdvojování kalendáři v userovi!
   */
  getCalendar: function getCalendar() {
    this.mainElm.setAttribute("id", "calendar");
    this.daysElm.setAttribute("class", "days"); // Skládání kalendáře dohromady - oprava zdvojování kalendáře po zavření apod.

    if (!this.mainElm.querySelector("div.month")) this.mainElm.appendChild(this.createHeaderMonth());
    if (!this.mainElm.querySelector("#swp-cal-weekdays")) this.mainElm.appendChild(this.createHeaderWeekdays());
    if (!this.mainElm.querySelector("ul.days")) this.mainElm.appendChild(this.getWeeks());
    this.mainElm.querySelector("#calendar li.next").addEventListener("click", this);
    this.mainElm.querySelector("#calendar li.prev").addEventListener("click", this);
    return;
  },
  run: function run() {
    this.getMonths(this.relMonth);

    if (this.anchorList) {
      // console.log("zaciname");
      this.getListPlaceholder(this.listNumEvents);
    }

    if (this.anchorMiniCal) {
      this.getCalendar();
      this.anchorMiniCal.appendChild(this.mainElm);
    }
  },

  /**
   * Funkce, která handluje všechny eventy, zavěšený na tomto objektu (kouzlo!)
   */
  handleEvent: function handleEvent(ev) {
    var target = ev.target.className;

    switch (target) {
      case "next":
        swpCal.fcnNext();
        break;

      case "prev":
        swpCal.fcnPrev();
        break;
    }
  }
};

var ajax = function ajax() {
  /**
   * @todo Upravit hardcode, potenciální přepis a optimalizace
   */
  var dataSet = {
    action: 'swp-cal-event',
    year: 2019,
    //inactive
    month: 10,
    //inactive
    security: simpleWPCal.security
  }; // toto by šlo přepsat lépe, ale podle toho můžu backendově filtrovat pouze "tento" měsíc, opakující se a vícedenní a tím si posílat míň dat

  var data = "action=".concat(dataSet.action, "&year=").concat(dataSet.year, "&month=").concat(dataSet.month, "&security=").concat(dataSet.security);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", simpleWPCal.ajaxurl, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      var result = xhr.responseText;
      resultCallback(result); // console.log(result);
    }
  };

  xhr.send(data);
  /**
   * Renderování přijatých dat
   * @param {object} result 
   * @todo Prakticky celý předělat
   */

  var resultCallback = function resultCallback(result) {
    var events = JSON.parse(result);
    console.log(events); // Renderování malého kalendáře

    if (swpCal.anchorMiniCal) {
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        /**
         * 1. jednodenní akce
         * 2. vícedenní akce
         * 3. opakující se akce
         * 4. (vícedenní opakující se akce?)
         */

        if (parseInt(event.eventDays) > 1) {
          // console.log("multiple");
          // console.log(event);
          swpCal.addEventMultipleDays(event);
        } else if (event.eventRepeat !== "0") {
          // console.log("repeated");
          // console.log(event);
          swpCal.addEventRepeated(event);
        } else if (parseInt(event.eventDays) === 1) {
          // console.log("oneday");
          // console.log(event);
          swpCal.addEventOneDay(event);
        } else {
          console.error("Not sure what kind of event is it.");
        }
      }
    } // Renderování planneru

    /**
     * if - planer placement je na místě
     * @todo: checknout, jestli to náhodou už není vyrenderované
     */


    if (swpCal.anchorList) {
      // render result to placeholders
      if (!swpCal.listRendered) swpCal.renderList(events, swpCal.listNumEvents);
    }
  };
};

var setEventListeners = function setEventListeners() {
  if (swpCal.anchorMiniCal) {
    document.querySelector("#calendar li.next").addEventListener("click", ajax);
    document.querySelector("#calendar li.prev").addEventListener("click", ajax);
  }
}; // Pokud jsem v admin módu, toto se nevykoná


if (swpCal.anchorList || swpCal.anchorMiniCal) {
  document.addEventListener("DOMContentLoaded", setEventListeners);
  document.addEventListener("DOMContentLoaded", ajax);
}

swpCal.run(); // export { swpCal };