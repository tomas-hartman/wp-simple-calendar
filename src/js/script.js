const swpCal = {
    weekdayNames: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
    monthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],

    anchorMiniCal: document.getElementById("swp-cal-mini-main"),
    anchorList: document.getElementById("swp-cal-list-main"),
    anchorAdminMetabox: document.getElementById("swp-cal-metabox"),
    mainElm: document.createElement("div"),
    daysElm: document.createElement("ul"),
    today: new Date(),
    todayNorm: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

    relMonth: 0,
    firstDayOfMonth: "",
    firstDayOfNextMonth: "",
    numOfDays: "",
    daysArr: [],
    displayedMonth: "",
    listRendered: false,
    listNumEvents: 5,
    // listNumEvents: 12,

    calFormat: "cs",
    events: null,

    getEvents() {
        if (typeof simpleWPCalEvents !== 'undefined') this.events = JSON.parse(simpleWPCalEvents.events);
    },

    /**
     * Helper funkce. Nastavuje základní proměnné pro jednotlivé funkce podle relativního měsíce.
     * @access init, refreshData()
     * @param {number} relMonth Konstanta s relativním počtem měsíců vůči dnešku
     * @var firstDayOfMonth První den daného měsíce
     * @var firstDayOfNextMonth První den následujícího měsíce
     * @var numOfDays Počet dní v měsíci
     * @var daysArr Pomocné pole s daty jednotlivých dnů v měsíci 
     */
    getMonths(relMonth) {
        this.firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + relMonth);
        this.firstDayOfNextMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1);
        this.lastDayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1, 0);
        this.lastDayOfPrevMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), 0);
        this.displayedMonth = this.firstDayOfMonth.getMonth() + 1;
        this.numOfDays = Math.floor((this.firstDayOfNextMonth - this.firstDayOfMonth) / (1000 * 60 * 60 * 24)); // při přeměně času na zimní může mít jiný počet hodin @todo je správně floor?!
        this.daysArr = [];

        for (let i = 1; i <= this.numOfDays; i++) {
            this.daysArr.push(i);
        }
    },

    createHeaderWeekdays() {
        // if(this.mainElm.querySelector("#swp-cal-weekdays")) return null;

        const ulWeekdays = document.createElement("ul");

        ulWeekdays.setAttribute("class", "weekdays");
        ulWeekdays.setAttribute("id", "swp-cal-weekdays");

        for (let i = 0; i < 7; i++) {
            let elm = document.createElement("li");
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
    createMonthTitle(firstDayOfMonth) {
        const month = this.monthNames[firstDayOfMonth.getMonth()];
        const year = firstDayOfMonth.getFullYear();

        return `${month} ${year}`;
    },

    createHeaderMonth() {
        const divMonth = document.createElement("div");
        divMonth.setAttribute("class", "month");

        divMonth.innerHTML = `
            <ul>
                <li class="prev">«</li>
                <li class="next">»</li>
                <li class="month-header">${this.createMonthTitle(this.firstDayOfMonth)}</li>
            </ul>
        `;

        return divMonth;
    },

    /**
     * Pomocná funkce pro getWeeks() - nevolat samostatně!
     * Vytvoří mi elementy pro jednotlivé dny, včetně popisků a zvýraznění
     * @param {number} originDate číslo dne z kalendáře
     * @param {*} params Parametry k jednotlivým dnům, zejména popisky událostí
     * @todo
     */
    createElm(originDate, params) {
        const elm = document.createElement("li");
        const span = document.createElement("span");
        let date = originDate;

        // Chci, aby datum v classe bylo ve formátu 05, 06 apod.
        if (typeof date !== "undefined" && date < 10) {

            date = `0${originDate}`;
        }

        if (this.firstDayOfMonth.getFullYear() === this.today.getFullYear() && this.firstDayOfMonth.getMonth() === this.today.getMonth() && originDate === this.today.getDate()) {
            span.setAttribute("class", "active");
            span.setAttribute("id", `day-${date}`);
            span.innerText = originDate;
            elm.appendChild(span);

            return elm;
        }
        if (date) {
            span.innerText = originDate;
            span.setAttribute("id", `day-${date}`);
            elm.appendChild(span);
        }
        if (params) {
            // elm.appendChild(document.createElement("span"));
            // add more
        }
        return elm;
    },

    createTooltip(elm, width = null) {
        // width: 270px;
        // margin-left: calc(-270px/2);

        const span = document.createElement("span");
        span.classList.add("day-events");

        elm.classList.add("event");
        elm.classList.add("tooltip");

        if (width) {
            const style = `width: ${width}px; margin-left: calc(-${width}px/2); visibility: visible;`;
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
    createEventElm(event, elm) {

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", event.permalink);
        a.innerText = event.title;
        li.appendChild(a);

        const checkElm = elm.querySelector(".day-events ul");
        const checkHref = elm.querySelector(`a[href='${event.permalink}']`);

        if (checkElm && !checkHref) {
            checkElm.appendChild(li);
        } else {
            const span = this.createTooltip(elm);
            const ul = document.createElement("ul");

            ul.appendChild(li);
            span.appendChild(ul);

            elm.appendChild(span);
        }
    },

    /**
     * Funkce, která vrací kopii objektu s upraveným datem konání
     * Vkládá se do objektu pro vytváření nadcházejících událostí
     * @param {object} event 
     * @param {Date} date 
     */
    createEventForList(event, date, dateEnd) {

        let eventCopy = JSON.parse(JSON.stringify(event)); // ohack na kopii objektu
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
    getWeeks() {
        const days = document.createElement("ul");
        days.setAttribute("class", "days");

        let firstWeekConst = false;
        let firstDay = this.firstDayOfMonth.getDay();

        if (firstDay === 0) {
            firstDay = 7
        }

        while (this.daysArr.length > 0) {
            for (let i = 1; i < 8; i++) {
                if (i >= firstDay && !firstWeekConst) { // Případ, kdy měsíc začíná o víkendu
                    let daysArrItem = this.daysArr.shift();
                    let dayElm = this.createElm(daysArrItem)
                    if (i === 6 || i === 7) dayElm.classList.add("weekend");
                    firstWeekConst = true;

                    days.appendChild(dayElm); // RENDER FULL
                    continue;
                }

                if (firstWeekConst && this.daysArr.length > 0) {
                    let daysArrItem = this.daysArr.shift();
                    let dayElm = this.createElm(daysArrItem)
                    if (i === 6 || i === 7) dayElm.classList.add("weekend");

                    days.appendChild(dayElm); // RENDER FULL
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
    getDateString(date) {
        const newDate = new Date(date);
        let dayString = newDate.getDate().toString();
        let monthString = (newDate.getMonth() + 1).toString();

        if (dayString.length === 1) {
            dayString = `0${dayString}`;
        };

        if (monthString.length === 1) {
            monthString = `0${monthString}`;
        };

        const dateString = `${newDate.getFullYear()}-${monthString}-${dayString}`;

        return dateString;
    },

    // Posouvání v kalendáři dopředu a dozadu a jeho refreshe //  
    refreshData(relMonth) {
        const monthHeader = document.querySelector("#calendar li.month-header")

        this.getMonths(relMonth);
        monthHeader.innerHTML = this.createMonthTitle(this.firstDayOfMonth);
        this.mainElm.querySelector("ul.days").remove();
        this.mainElm.appendChild(this.getWeeks());
    },

    fcnNext() {
        this.relMonth += 1;
        this.refreshData(this.relMonth);
        this.renderContentAll();
    },

    fcnPrev() {
        this.relMonth -= 1;
        this.refreshData(this.relMonth);
        this.renderContentAll();
    },

    addEventOneDay(event) {
        const date = event.eventDate.split("-");
        const thisMonth = this.firstDayOfMonth.getMonth() + 1;
        const thisYear = this.firstDayOfMonth.getFullYear();

        if (parseInt(date[1]) === thisMonth && parseInt(date[0]) === thisYear) {
            let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

            this.createEventElm(event, elm);
        }
    },

    addEventMultipleDays(event, thisMonthStr) {
        /**
         * Dva edge casy: událost, která trvá do dalšího měsíce DONE
         * událost, která pokračuje z minulého měsíce DONE
         * potenciální víceměsíční akce! @todo
         */

        const date = event.eventDate.split("-");
        const thisMonth = this.firstDayOfMonth.getMonth() + 1;
        const thisYear = this.firstDayOfMonth.getFullYear();
        const numOfDays = this.lastDayOfMonth.getDate();
        const eventEndDate = parseInt(date[2]) + parseInt(event.eventDays);
        const lastDayOfPrevMonth = this.lastDayOfPrevMonth.getDate();

        // case 1 - tento měsíc
        if (parseInt(date[1]) === thisMonth && parseInt(date[0]) === thisYear) {
            for (let i = 0; i < event.eventDays; i++) {
                let idDate = parseInt(date[2]) + i;

                if (idDate <= numOfDays) {
                    idDate = idDate.toString();
                    if (idDate.length < 2) {
                        idDate = `0${idDate}`
                    };

                    const elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${idDate}`);
                    this.createEventElm(event, elm);
                }
            }
        }
        // case 2 akce z minulého měsíce: začíná minulý měsíc a zároveň jeho datumStartu + početDní je větší, než počet dní toho měsíce
        else if (parseInt(date[1]) === thisMonth - 1 && eventEndDate > lastDayOfPrevMonth) {
            const diff = eventEndDate - lastDayOfPrevMonth;

            for (let i = 1; i < diff; i++) {
                let idDate = i.toString();
                if (idDate.length < 2) {
                    idDate = `0${idDate}`
                };

                const elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${idDate}`);
                this.createEventElm(event, elm);
            }
        }
    },

    addEventRepeated(event) {
        const thisMonth = this.firstDayOfMonth.getMonth() + 1;
        const date = event.eventDate.split("-");
        const firstDate = new Date(event.eventDate);
        firstDate.setHours(0);
        let lastDate = "";

        if (event.eventRepetitionEnd !== "") {
            lastDate = new Date(event.eventRepetitionEnd);
        } else lastDate = null;

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
                console.error(`Error. Something went wrong with event "${event.title}". Check the event from your wordpress admin interface.`);
                break;
        }

        /**
         * Jako jediná se může zobrazovat i před prvním datem akce (svátky, výročí, navíc je to tak daleko že je to jedno) pokud je forever
         */
        function addRepeatedYearly() {
            if (parseInt(date[1]) === thisMonth) {
                const currentEventDate = new Date(swpCal.firstDayOfMonth.getFullYear(), swpCal.firstDayOfMonth.getMonth(), date[2]);

                if (lastDate && currentEventDate > lastDate) return; // nezobrazujeme po datu konce
                if (lastDate && firstDate > currentEventDate) return; // nezobrazujeme před datem začátku - pokud má zároveň i konec

                let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

                swpCal.createEventElm(event, elm);
            }
        }

        function addRepeatedMonthly() {
            const currentEventDate = new Date(swpCal.firstDayOfMonth.getFullYear(), swpCal.firstDayOfMonth.getMonth(), date[2]);

            if (lastDate && currentEventDate > lastDate) return; // nezobrazujeme po datu konce
            if (firstDate > currentEventDate) return; // nezobrazujeme před datem začátku

            let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

            swpCal.createEventElm(event, elm);
        }

        function addRepeatedWeekly() {
            /**
             * 2019-10-14 => pondělí, akce se bude opakovat každé pondělí. Pondělí je tedy 2019-10-14 + 7*n (1)
             * další měsíc:
             * 1. najdi pondělí.
             * -- 1. den měsíce - úterý (tzn. 2)
             *    1. pondělí v měcíci
             *      úterý(2) - pondělí(den 1 + 7 dní (další týden - protože je větší)) = 6 (korekce je tedy 6)
             */
            const eventDay = firstDate.getDay(); // den v měsíci, kdy se akce koná
            const monthDayOfWeek = swpCal.firstDayOfMonth.getDay(); // první den daného měsíce
            let diff;

            if (eventDay < monthDayOfWeek) {
                diff = (eventDay + 7) - monthDayOfWeek;
            } else diff = eventDay - monthDayOfWeek;

            let currentEventDayOfMonth = diff + 1; // tento den se akce koná v tomto měsíci poprvé; všechny další event days jsou toto + 7
            let currentEventDate = new Date(swpCal.firstDayOfMonth.getFullYear(), swpCal.firstDayOfMonth.getMonth(), currentEventDayOfMonth);

            /**
             * 1. konkrétní instance události se generuje pouze do konce daného měsíce &&
             * 2. pokud končí už před koncem měsíce, dále už se neopakuje
             * 3. pokud začíná až v průběhu měsíce, taky se negeneruje
             */
            while (currentEventDayOfMonth <= swpCal.lastDayOfMonth.getDate()) {
                if (lastDate && currentEventDate > lastDate) break; // událost má eventRepetitionEnd
                if (currentEventDate < firstDate) { // událost se nemá opakovat předtím, než byla vytvořena
                    currentEventDayOfMonth = currentEventDayOfMonth + 7;
                    currentEventDate = new Date(swpCal.firstDayOfMonth.getFullYear(), swpCal.firstDayOfMonth.getMonth(), currentEventDayOfMonth);
                    continue;
                }

                let str = currentEventDayOfMonth.toString();
                if (str.length < 2) {
                    str = `0${str}`;
                }

                let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${str}`);

                swpCal.createEventElm(event, elm);

                currentEventDayOfMonth = currentEventDayOfMonth + 7;
                currentEventDate = new Date(swpCal.firstDayOfMonth.getFullYear(), swpCal.firstDayOfMonth.getMonth(), currentEventDayOfMonth);
            }
        }
    },

    /**
     * 
     * @param {array} events výsledek XHR requestu
     * @param {number} size počet dní, pro které chci akci vykreslit -> tolikrát se maximálně může za sebou událost zobrazit
     * @todo __Přepsat celou metodu a rozdělit ji na jednotlivé funkce__
     */
    renderList(events, size) {
        let container = document.createElement("ul");
        container.classList.add("swp-list");
        const upcomingEvents = [];
        this.listRendered = true;

        /**
         * Pole s akcemi
         */
        for (let i = 0; i < events.length; i++) {
            let repeatMode = parseInt(events[i].eventRepeat);
            let daysLen = parseInt(events[i].eventDays);
            const eventStartDate = new Date(events[i].eventDate);
            let eventEndDate = "";
            let eventRepetitionEnd = "";

            // PHASE 1: GETTING DATA READY //

            if (events[i].eventEnd && events[i].eventEnd !== "0") {
                eventEndDate = new Date(events[i].eventEnd);
            } else {
                eventEndDate = new Date(events[i].eventDate);
                eventEndDate.setDate(eventEndDate.getDate() + (daysLen - 1));
            }

            if (events[i].eventRepetitionEnd && events[i].eventRepetitionEnd !== "0") {
                eventRepetitionEnd = new Date(events[i].eventRepetitionEnd);
            }

            // PHASE 2: PREPARING upcomingEvents // 
            /**
             * 1. obyč nadcházející jednorázové akce
             */
            if (eventStartDate >= this.today && repeatMode === 0 && daysLen === 1) {
                upcomingEvents.push(events[i]);
            }

            /**
             * 2. vícedenní akce @todo vícedenní opakované akce!
             * dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
             */
            else if (daysLen > 1 && (eventStartDate >= this.today || eventEndDate >= this.today) && repeatMode === 0) {
                // případ kdy akce končí po dnešku, ale začíná někdy dříve - i ty potřebuju použít
                if (eventStartDate < this.today && eventEndDate >= this.today) {

                    upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
                    continue;
                }
                // standardní případ, kdy akce začíná v budoucnosti
                upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
            }

            /**
             * 3. opakující se akce
             * 
             * @todo case 2 a case 3 jsou úplně totožné, rozdíl je v tom, že u jednoho se přičítá jednička ke dni, u druhého k roku
             * @todo case 1 je kromě offsetu v případě prvního výskytu hodně blízký dalším casům
             */
            else if (repeatMode > 0) {
                switch (repeatMode) {
                    case 1: // týdně
                        /**
                         * budu checkovat v jakej den se koná a přidám 'size' jejich instancí po datu today
                         * @todo this.relmonth bude dělat chyby v tomhle případě! - mělo by být pokaždý nula, ne?
                         */
                        let dayOfWeeklyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() /* + this.relMonth */ , eventStartDate.getDate());

                        for (let n = 0; n < size; n++) {
                            if (eventRepetitionEnd !== "" && eventRepetitionEnd < this.todayNorm) break; // break for events terminated already in the past
                            if (eventRepetitionEnd !== "" && dayOfWeeklyEvent > eventRepetitionEnd) break; // safe break for events ending in the future
                            if (dayOfWeeklyEvent >= this.today) {
                                upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                            } else {
                                // Pokud opakovaná událost začíná v minulosti
                                /**
                                 * tady to je potřeba opravit o rozdíl mezi prvním dnem v týdnu/akce
                                 * tady je potřeba 
                                 */
                                let diff = this.today - dayOfWeeklyEvent;
                                let yearMs = 24 * 60 * 60 * 1000;
                                let daysOffset = Math.floor(diff / yearMs); // rozdíl ve dnech - rozbíjelo by týdenní rozestupy
                                let weeksOffset = Math.ceil(daysOffset / 7); // rozdíl v týdnech - ten potřebuju, abych zachoval týdenní rozestupy

                                dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7 * weeksOffset);
                                upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                            }

                            dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7);
                        }
                        break;

                    case 2: // měsíční akce
                        let eventRepetitionStart = eventStartDate;

                        for (let n = 0; n < size; n++) {
                            if (eventRepetitionEnd !== "" && eventRepetitionEnd < this.todayNorm) break; // break for events terminated already in the past

                            if (eventRepetitionEnd !== "" && eventRepetitionStart > eventRepetitionEnd) break; // safe break for events ending in the future

                            if (eventRepetitionStart < this.todayNorm) {
                                eventRepetitionStart = new Date(this.today.getFullYear(), this.today.getMonth(), eventRepetitionStart.getDate());

                                if (eventRepetitionStart < this.todayNorm) {
                                    eventRepetitionStart = new Date(eventRepetitionStart.getFullYear(), eventRepetitionStart.getMonth() + 1, eventRepetitionStart.getDate());
                                }
                            }

                            upcomingEvents.push(this.createEventForList(events[i], eventRepetitionStart));
                            eventRepetitionStart = new Date(eventRepetitionStart.getFullYear(), eventRepetitionStart.getMonth() + 1, eventRepetitionStart.getDate());
                        }
                        break;

                    case 3: // roční akce
                        let dayOfYearlyEvent = eventStartDate;

                        for (let n = 0; n < size; n++) {
                            if (eventRepetitionEnd !== "" && eventRepetitionEnd < this.todayNorm) break;

                            if (eventRepetitionEnd !== "" && dayOfYearlyEvent > eventRepetitionEnd) break;

                            if (dayOfYearlyEvent < this.todayNorm) {
                                dayOfYearlyEvent = new Date(this.today.getFullYear(), dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());

                                // pokud je stále ještě menší, pak jde o událost, která už letos proběhla a je třeba ji přeskočit
                                if (dayOfYearlyEvent < this.todayNorm) {
                                    dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                                }
                            }

                            upcomingEvents.push(this.createEventForList(events[i], dayOfYearlyEvent));
                            dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                        }

                        break;

                    default:
                        console.warn(`Event repeatMode non-standard: ${repeatMode}`);
                        break;
                }
            } else {
                // FALLBACK IF NOTHING WORKS OUT WELL
                console.warn(`Event non-standard or broken data:`);
                console.warn(events[i]);
            }
        }

        upcomingEvents.sort((b, a) => {
            return new Date(b.eventDate) - new Date(a.eventDate);
        });

        /**
         * Renderování polí
         */

        const isContainer = document.querySelector("ul.swp-list") ? true : false
        if (isContainer) container = document.querySelector("ul.swp-list");

        if (upcomingEvents.length < size) size = upcomingEvents.length;

        if (upcomingEvents.length === 0) {
            this.anchorList.innerText = "Nejsou žádné nadcházející události.";
            return;
        }

        for (let y = 0; y < size; y++) {

            let eventElm = this.createListItem(upcomingEvents[y], y);

            if (isContainer) {
                document.querySelector(`ul.swp-list .swp-upcoming-event-${y}`).remove();
            }
            container.appendChild(eventElm);
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

    createListItem(event, iter) {
        const date = event.eventDate.split("-");
        const year = date[0];
        const yearFits = this.today.getFullYear() === parseInt(year) ? true : false;
        const eventTime = event.eventTime || null;
        let dayMonth = "";
        let eventTimeToDisplay = "";

        if (eventTime) {
            eventTimeToDisplay = eventTime.split("-")[0];
        }

        if (parseInt(event.eventDays) > 1 && typeof event.eventEndDate !== 'undefined') {
            const dateEnd = event.eventEndDate.split("-");
            dayMonth = `${parseInt(date[2])}. ${parseInt(date[1])}. 
                        <span class="swp-till">&#8208;</span> 
                        ${parseInt(dateEnd[2])}. ${parseInt(dateEnd[1])}.`;
        } else dayMonth = `${parseInt(date[2])}. ${parseInt(date[1])}.`;

        const li = document.createElement("li");
        const div = document.createElement("div");
        const spanDate = document.createElement("span");
        const spanYear = document.createElement("span");
        const divEvent = document.createElement("div");
        const aElm = document.createElement("a");
        const innerDivElm = document.createElement("div");

        li.classList.add(`swp-upcoming-event-${iter}`);
        div.classList.add(`swp-list-date`);
        spanDate.classList.add('swp-list-day-month');
        spanDate.innerHTML = dayMonth;
        spanYear.classList.add('swp-list-year');

        divEvent.classList.add("swp-list-title");
        aElm.setAttribute("href", event.permalink);
        aElm.setAttribute("title", event.title);

        innerDivElm.classList.add("swp-list-link-inner");
        innerDivElm.classList.add("truncate-overflow");
        innerDivElm.innerText = event.title;

        aElm.appendChild(innerDivElm);

        div.appendChild(spanDate);
        if (eventTime && parseInt(event.eventDays) === 1) {
            spanYear.classList.add("time");
            spanYear.innerText = eventTimeToDisplay;
            div.appendChild(spanYear);
        } else if (!yearFits) {
            spanYear.innerText = year;
            div.appendChild(spanYear);
        }

        divEvent.appendChild(aElm);

        li.appendChild(div);
        li.appendChild(divEvent);

        return li;
    },

    /**
     * @todo zbytečně nepřidávat podruhé ty listenery
     * @todo možná půjde odstranit oprava proti zdvojování kalendáři v userovi!
     */
    getCalendar() {
        this.mainElm.setAttribute("id", "calendar");
        this.daysElm.setAttribute("class", "days");

        // Skládání kalendáře dohromady - oprava zdvojování kalendáře po zavření apod.
        if (!this.mainElm.querySelector("div.month")) this.mainElm.appendChild(this.createHeaderMonth());
        if (!this.mainElm.querySelector("#swp-cal-weekdays")) this.mainElm.appendChild(this.createHeaderWeekdays());
        if (!this.mainElm.querySelector("ul.days")) this.mainElm.appendChild(this.getWeeks());

        this.mainElm.querySelector("#calendar li.next").addEventListener("click", this);
        this.mainElm.querySelector("#calendar li.prev").addEventListener("click", this);

        return;
    },

    renderContentAll() {
        let events = this.events;

        // Renderování malého kalendáře
        if (this.anchorMiniCal) {
            for (let i = 0; i < events.length; i++) {
                let event = events[i];

                /**
                 * 1. jednodenní akce
                 * 2. vícedenní akce
                 * 3. opakující se akce
                 * 4. (vícedenní opakující se akce?)
                 */

                if (parseInt(event.eventDays) > 1 && !parseInt(event.eventRepeat) > 0) {
                    swpCal.addEventMultipleDays(event);
                } else if (event.eventRepeat !== "0") {
                    swpCal.addEventRepeated(event);
                } else if (parseInt(event.eventDays) === 1) {
                    swpCal.addEventOneDay(event);
                } else {
                    console.warn("Not sure what kind of event is it.");
                }
            }
        }

        // Renderování planneru
        if (this.anchorList) {
            // render result to placeholders
            if (!this.listRendered) this.renderList(events, this.listNumEvents);
        }
    },

    run() {
        this.getEvents();
        this.getMonths(this.relMonth);

        /**
         * @todo @nemazat Možnost přidat sem placeholder "události se načítají".
         */
        // if(this.anchorList){
        //     // console.log("zaciname");
        // } else {console.warn("chybí Anchor List")};

        if (this.anchorMiniCal) {
            this.getCalendar();
            this.anchorMiniCal.appendChild(this.mainElm);
        } else {
            console.warn("chybí Anchor mini cal")
        };

        this.renderContentAll();
    },

    /**
     * Funkce, která handluje všechny eventy, zavěšený na tomto objektu (kouzlo!)
     */
    handleEvent: (ev) => {
        let target = ev.target.className;

        switch (target) {
            case "next":
                swpCal.fcnNext();
                break;
            case "prev":
                swpCal.fcnPrev();
                break;
        }
    }
}

// swpCal.run(); 

try {
    module.exports = swpCal;
} catch (error) {
    console.log("");
}