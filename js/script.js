const swpCal = {
    weekdayNames: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
    monthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],

    anchor: document.getElementById("swp-cal-mini-main"),
    mainElm: document.createElement("div"),
    daysElm: document.createElement("ul"),
    today: new Date(),

    relMonth: 0,
    firstDayOfMonth: "",
    firstDayOfNextMonth: "",
    numOfDays: "",
    daysArr: [],
    displayedMonth: "",

    /**
     * Helper funkce. Nastavuje základní proměnné pro jednotlivé funkce podle relativního měsíce.
     * @access init, refreshData()
     * @param {number} relMonth Konstanta s relativním počtem měsíců vůči dnešku
     * @var firstDayOfMonth První den daného měsíce
     * @var firstDayOfNextMonth První den následujícího měsíce
     * @var numOfDays Počet dní v měsíci
     * @var daysArr Pomocné pole s daty jednotlivých dnů v měsíci 
     */
    getMonths (relMonth) {
        this.firstDayOfMonth = new Date(this.today.getFullYear(), this.today.getMonth() + relMonth);
        this.firstDayOfNextMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1);
        this.lastDayOfMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth() + 1, 0);
        this.lastDayOfPrevMonth = new Date(this.firstDayOfMonth.getFullYear(), this.firstDayOfMonth.getMonth(), 0);
        this.displayedMonth = this.firstDayOfMonth.getMonth() + 1;
        this.numOfDays = Math.floor((this.firstDayOfNextMonth - this.firstDayOfMonth) / (1000 * 60 * 60 * 24)); // při přeměně času na zimní může mít jiný počet hodin
        this.daysArr = [];

        for (let i = 1; i <= this.numOfDays; i++) {
            this.daysArr.push(i);
        }
    },

    createHeaderWeekdays () {
        const ulWeekdays = document.createElement("ul");

        ulWeekdays.setAttribute("class", "weekdays");

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
    createMonthTitle (firstDayOfMonth) {
        const month = this.monthNames[firstDayOfMonth.getMonth()];
        const year = firstDayOfMonth.getFullYear();

        return `${month} ${year}`;
    },

    createHeaderMonth () {
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
     * @param {number} date číslo dne z kalendáře
     * @param {*} params Parametry k jednotlivým dnům, zejména popisky událostí
     * @todo
     */
    createElm (originDate, params) {
        const elm = document.createElement("li");
        const span = document.createElement("span");
        let date = originDate;

        // Chci, aby datum v classe bylo ve formátu 05, 06 apod.
        if (typeof date !== "undefined" && date < 10) {

            date = `0${originDate}`;
            // console.log(date);
        }

        if (this.firstDayOfMonth.getMonth() === this.today.getMonth() && originDate === this.today.getDate()) {
            // const todayElm = document.createElement("span");
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

    /**
     * @param {object} event Událost, kterou budu připojovat
     * @param {DOM Element} elm Elm v kalendáři se dnem ke kterému budu novou událost připojovat
     * @todo opravit bug 2.11. --> po dvojkliku se zdvojí "Opakující se vícedenní akce"
     */
    createEventElm(event, elm){
        
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", event.permalink);
        a.innerText = event.title;
        li.appendChild(a);

        const checkElm = elm.querySelector(".day-events ul");
        const checkHref = elm.querySelector(`a[href='${event.permalink}']`);
        
        if(checkElm && !checkHref){
            checkElm.appendChild(li);
        } else {
            const span = document.createElement("span");
            const ul = document.createElement("ul");
            span.classList.add("day-events");
            ul.appendChild(li);
            span.appendChild(ul);

            elm.classList.add("event");
            elm.classList.add("tooltip");

            elm.appendChild(span);
        }
    },

    /**
     * Hlavní funkce
     * Vygeneruje strukturu kalendáře pro jednotlivé dny
     * @returns DOM s vytvořenými elementy pro jednotlivé dny
     * @access main generování kalendáře a refreshData()
     */
    getWeeks () {
        const days = document.createElement("ul");
        days.setAttribute("class", "days");

        let firstWeekConst = false;
        let firstDay = this.firstDayOfMonth.getDay();

        if (firstDay === 0) { firstDay = 7 }

        while (this.daysArr.length > 0) {
            for (let i = 1; i < 8; i++) {
                if (i >= firstDay && !firstWeekConst) { // Následně už je jedno, jakou hodnotu má i, ale v první iteraci je to důležité
                    let daysArrItem = this.daysArr.shift();
                    firstWeekConst = true;

                    days.appendChild(this.createElm(daysArrItem)); // RENDER FULL
                    continue;
                }

                if (firstWeekConst && this.daysArr.length > 0) {
                    let daysArrItem = this.daysArr.shift();

                    days.appendChild(this.createElm(daysArrItem)); // RENDER FULL
                    continue;
                }

                days.appendChild(this.createElm()); // RENDER EMPTY          
            }
        }
        return days;
    },

    // Posouvání v kalendáři dopředu a dozadu a jeho refreshe //  
    refreshData (relMonth) {
        const monthHeader = document.querySelector("#calendar li.month-header")

        this.getMonths(relMonth);
        monthHeader.innerHTML = this.createMonthTitle(this.firstDayOfMonth);
        this.mainElm.querySelector("ul.days").remove();
        this.mainElm.appendChild(this.getWeeks());
    },

    fcnNext () {
        this.relMonth += 1;
        this.refreshData(this.relMonth);
    },

    fcnPrev () {
        this.relMonth -= 1;
        this.refreshData(this.relMonth);
    },

    addEventOneDay (event) {
        const date = event.eventDate.split("-");
        const thisMonth = this.firstDayOfMonth.getMonth() + 1;
        const thisYear = this.firstDayOfMonth.getFullYear();

        if (parseInt(date[1]) === thisMonth && parseInt(date[0]) === thisYear) {
            let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

            this.createEventElm(event, elm);
        }
    },

    addEventMultipleDays (event, thisMonthStr) {
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
            for(let i=0;i<event.eventDays;i++){
                let idDate = parseInt(date[2]) + i;
                
                if(idDate <= numOfDays){
                    idDate = idDate.toString();
                    if(idDate.length < 2){ idDate = `0${idDate}` };

                    const elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${idDate}`);
                    this.createEventElm(event, elm);
                }
            }
        }
        // case 2 akce z minulého měsíce: začíná minulý měsíc a zároveň jeho datumStartu + početDní je větší, než počet dní toho měsíce
        else if(parseInt(date[1]) === thisMonth-1 && eventEndDate > lastDayOfPrevMonth){
            const diff = eventEndDate-lastDayOfPrevMonth;
            
            for(let i=1;i<diff;i++){
                let idDate = i.toString();
                if(idDate.length < 2){ idDate = `0${idDate}` };

                const elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${idDate}`);
                this.createEventElm(event, elm);
            }
        }
    },

    addEventRepeated (event) {
        const thisMonth = this.firstDayOfMonth.getMonth() + 1;
        const date = event.eventDate.split("-");
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
                let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

                swpCal.createEventElm(event, elm);
            }
        }
        
        function addRepeatedMonthly(){
            let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);

            swpCal.createEventElm(event, elm);
        }

        /**
         * @todo Upravit, aby se nezobrazovalo před prvním datem opakování
         */
        function addRepeatedWeekly(){
            /**
             * 2019-10-14 => pondělí, akce se bude opakovat každé pondělí. Pondělí je tedy 2019-10-14 + 7*n (1)
             * další měsíc:
             * 1. najdi pondělí.
             * -- 1. den měsíce - úterý (tzn. 2)
             *    1. pondělí v měcíci
             *      úterý(2) - pondělí(den 1 + 7 dní (další týden - protože je větší)) = 6 (korekce je tedy 6)
             */

            const firstDate = new Date(event.eventDate);
            const eventDay = firstDate.getDay(); // den v měsíci, kdy se akce koná
            const monthDayOfWeek = swpCal.firstDayOfMonth.getDay(); // první den daného měsíce
            let diff;

            if(eventDay < monthDayOfWeek){
                diff = (eventDay + 7) - monthDayOfWeek;
            } else {
                diff = eventDay - monthDayOfWeek;
            }

            let eventStartDate = diff + 1; // tento den se akce koná v tomto měsíci poprvé; všechny další event days jsou toto + 7

            while(eventStartDate < swpCal.lastDayOfMonth.getDate()){
                    let str = eventStartDate.toString();
                    if(str.length < 2){
                        str = `0${str}`;
                    }

                    let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${str}`);
                    
                    swpCal.createEventElm(event, elm);
                
                eventStartDate = eventStartDate + 7;
            }
        }
    },

    run () {
        this.getMonths(this.relMonth);

        this.mainElm.setAttribute("id", "calendar");
        this.daysElm.setAttribute("class", "days");

        // Skládání kalendáře dohromady 
        this.mainElm.appendChild(this.createHeaderMonth());
        this.mainElm.appendChild(this.createHeaderWeekdays());
        this.mainElm.appendChild(this.getWeeks());

        this.anchor.appendChild(this.mainElm);

        document.querySelector("#calendar li.next").addEventListener("click", this);
        document.querySelector("#calendar li.prev").addEventListener("click", this);
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

const ajax = () => {
    /**
     * @todo Upravit hardcode, potenciální přepis a optimalizace
     */
    const dataSet = {
        action: 'swp-cal-event',
        year: 2019, //inactive
        month: 10, //inactive
        security: simpleWPCal.security
    };
    // toto by šlo přepsat lépe, ale podle toho můžu backendově filtrovat pouze tento měsíc, opakující se a vícedenní
    const data = `action=${dataSet.action}&year=${dataSet.year}&month=${dataSet.month}&security=${dataSet.security}`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", simpleWPCal.ajaxurl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            var result = xhr.responseText;
            resultCallback(result);
            // console.log(result);
        }
    };

    xhr.send(data);

    /**
     * MOCKUP Funkce
     * @param {object} result 
     * @todo Prakticky celý předělat
     */
    const resultCallback = (result) => {
        const events = JSON.parse(result);
        
        console.log(events);

        for(let i = 0; i < events.length;i++){
            let event = events[i];

            /**
             * 1. jednodenní akce
             * 2. vícedenní akce
             * 3. opakující se akce
             * 4. (vícedenní opakující se akce?)
             */

            if(parseInt(event.eventDays) > 1){
                // console.log("multiple");
                // console.log(event);
                swpCal.addEventMultipleDays(event);
            } else if(event.eventRepeat !== "0"){
                // console.log("repeated");
                // console.log(event);
                swpCal.addEventRepeated(event);
            } else if(parseInt(event.eventDays) === 1){
                // console.log("oneday");
                // console.log(event);
                swpCal.addEventOneDay(event);
            } else {
                console.error("Not sure what kind of event is it.");
            }
        }
    }
}

const setEventListeners = () => {
    document.querySelector("#calendar li.next").addEventListener("click", ajax);
    document.querySelector("#calendar li.prev").addEventListener("click", ajax);
}

document.addEventListener("DOMContentLoaded", setEventListeners);
document.addEventListener("DOMContentLoaded", ajax);

swpCal.run();