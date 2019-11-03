const swpCal = {
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
    getMonths (relMonth) {
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

    createHeaderWeekdays () {
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

    createTooltip(elm, width = null){        
        // width: 270px;
        // margin-left: calc(-270px/2);

        const span = document.createElement("span");
        span.classList.add("day-events");

        elm.classList.add("event");
        elm.classList.add("tooltip");

        if(width){
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
            const span = this.createTooltip(elm);

            // const span = document.createElement("span");
            const ul = document.createElement("ul");
            // span.classList.add("day-events");
            ul.appendChild(li);
            span.appendChild(ul);

            // elm.classList.add("event");
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
    createEventForList (event, date, dateEnd) {

        let eventCopy = JSON.parse(JSON.stringify(event)); // ohack na kopii objektu
        eventCopy.eventDate = this.getDateString(date);
        if(dateEnd) eventCopy.eventEndDate = this.getDateString(dateEnd);

        return eventCopy;
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
                if (i >= firstDay && !firstWeekConst) { // Případ, kdy měsíc začíná o víkendu
                    let daysArrItem = this.daysArr.shift();
                    let dayElm = this.createElm(daysArrItem)
                    if(i === 6 || i ===7) dayElm.classList.add("weekend");
                    firstWeekConst = true;

                    days.appendChild(dayElm); // RENDER FULL
                    continue;
                }

                if (firstWeekConst && this.daysArr.length > 0) {
                    let daysArrItem = this.daysArr.shift();
                    let dayElm = this.createElm(daysArrItem)
                    if(i === 6 || i ===7) dayElm.classList.add("weekend");

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
    getDateString (date){        
        const newDate = new Date(date);
        let dayString = newDate.getDate().toString();
        let monthString = (newDate.getMonth() + 1).toString();
        
        if(dayString.length === 1){
            dayString = `0${dayString}`;
        };

        if(monthString.length === 1){
            monthString = `0${monthString}`;
        };
        
        const dateString = `${newDate.getFullYear()}-${monthString}-${dayString}`;

        return dateString;
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

            while(eventStartDate <= swpCal.lastDayOfMonth.getDate()){
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

    /**
     * Renders placeholder for events list
     * @param {number} size 
     */
    getListPlaceholder (size){
        const ulElm = document.createElement("ul");
        ulElm.classList.add("swp-list");

        for(let i=0;i<size;i++){
            const liElm = document.createElement("li");
            const divDate = document.createElement("div");
            const divTitle = document.createElement("div");


            liElm.classList.add(`swp-upcoming-event-${i}`);

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
    renderList (events, size) {
        // @todo pokud mám nastávajících událostí míň, než je size, pak vykreslit správně! 
        let container = document.createElement("ul");
        container.classList.add("swp-list");
        const upcomingEvents = [];
        this.listRendered = true;

        /**
         * Pole s akcemi
         */
        for(let i=0;i<events.length;i++){
            let repeatMode = parseInt(events[i].eventRepeat);
            let daysLen = parseInt(events[i].eventDays);
            const eventStartDate = new Date(events[i].eventDate);
            let eventEndDate = "";
            
            if(events[i].eventEnd && events[i].eventEnd !== "0"){
                eventEndDate = new Date(events[i].eventEnd);
            } else {
                eventEndDate = new Date(events[i].eventDate);
                // eventEndDate.setHours(eventEndDate.getHours() + daysLen * 24);
                eventEndDate.setDate(eventEndDate.getDate() + (daysLen - 1));
            }




            // 1. obyč nadcházející jednorázové akce
            if(eventStartDate >= this.today && repeatMode === 0 && daysLen === 1){
                upcomingEvents.push(events[i]);
            }

            // 2. vícedenní akce @todo vícedenní opakované akce!
            // dva případy: vícedenní akce začíná zítra nebo vícedenní akce už běží
            else if(daysLen > 1 && (eventStartDate >= this.today || eventEndDate >= this.today)){
                // případ kdy akce končí po dnešku, ale začíná někdy dříve - i ty potřebuju použít
                if(eventStartDate < this.today && eventEndDate >= this.today){

                    upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
                    continue;
                }
                // standardní případ, kdy akce začíná v budoucnosti
                upcomingEvents.push(this.createEventForList(events[i], eventStartDate, eventEndDate));
            } 

            // 3. opakující se akce
            /**
             * @todo case 2 a case 3 jsou úplně totožné, rozdíl je v tom, že u jednoho se přičítá jednička ke dni, u druhého k roku
             * @todo case 1 je kromě offsetu v případě prvního výskytu hodně blízký dalším casům
             */
            else if(repeatMode > 0){
                switch (repeatMode) {
                    case 1: // týdně
                        /**
                         * budu checkovat v jakej den se koná a přidám 'size' jejich instancí po datu today
                         * @todo this.relmonth bude dělat chyby v tomhle případě!
                         */
                        let dayOfWeeklyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());
                            
                            for(let n=0;n<size;n++){ 
                                if(dayOfWeeklyEvent >= this.today){
                                    upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                                } else {
                                    // tady to je potřeba opravit o rozdíl mezi prvním dnem v týdnu/akce 
                                    let diff = this.today - dayOfWeeklyEvent;
                                    let yearMs = 24*60*60*1000;
                                    let daysOffset = Math.floor(diff/yearMs); // rozdíl ve dnech - rozbíjelo by týdenní rozestupy
                                    let weeksOffset = Math.ceil(daysOffset/7); // rozdíl v týdnech - ten potřebuju, abych zachoval týdenní rozestupy

                                    dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7*weeksOffset);
                                    upcomingEvents.push(this.createEventForList(events[i], dayOfWeeklyEvent));
                                }

                                dayOfWeeklyEvent = new Date(dayOfWeeklyEvent.getFullYear(), dayOfWeeklyEvent.getMonth(), dayOfWeeklyEvent.getDate() + 7);
                            }
                        break;
                        
                    case 2: // měsíční akce
                            let dayOfEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());
                            
                            for(let n=0;n<size;n++){ 
                                if(dayOfEvent >= this.today){
                                    upcomingEvents.push(this.createEventForList(events[i], dayOfEvent));
                                } else {
                                    dayOfEvent = new Date(dayOfEvent.getFullYear(), dayOfEvent.getMonth() + 1, dayOfEvent.getDate());
                                    upcomingEvents.push(this.createEventForList(events[i], dayOfEvent));
                                }

                                dayOfEvent = new Date(dayOfEvent.getFullYear(), dayOfEvent.getMonth() + 1, dayOfEvent.getDate());
                            }
                        break;

                    case 3: // roční akce
                        let dayOfYearlyEvent = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth() + this.relMonth, eventStartDate.getDate());
                            
                        for(let n=0;n<size;n++){ 
                            if(dayOfYearlyEvent >= this.today){
                                upcomingEvents.push(this.createEventForList(events[i], dayOfYearlyEvent));
                            } else {
                                dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                                upcomingEvents.push(this.createEventForList(events[i], dayOfYearlyEvent));
                            }

                            dayOfYearlyEvent = new Date(dayOfYearlyEvent.getFullYear() + 1, dayOfYearlyEvent.getMonth(), dayOfYearlyEvent.getDate());
                        }

                        break;

                    default:
                        console.log(`event repeatMode not standard: ${repeatMode}`);
                        break;
                }
            }
        }

        upcomingEvents.sort((b,a) => {
            return new Date(b.eventDate) - new Date(a.eventDate);
        });
        
        // console.log("allover:");
        // console.log(upcomingEvents);
        
        /**
         * Renderování polí
         */

        const isContainer = document.querySelector("ul.swp-list") ? true : false
        if(isContainer) container = document.querySelector("ul.swp-list");
        
        for(let y=0; y<size; y++){
            
            let eventElm = this.createListItem(upcomingEvents[y], y);
            
            if(isContainer){
                document.querySelector(`ul.swp-list .swp-upcoming-event-${y}`).remove();
            }
            container.appendChild(eventElm);
                        
            
            // container.innerHTML += upcomingEvents[y].title;
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

    createListItem (event, iter) {
        console.log(event);
        const date = event.eventDate.split("-");
        const year = date[0];
        const yearFits = this.today.getFullYear() === parseInt(year) ? true : false;
        const eventTime = event.eventTime || null;
        let dayMonth = "";
        let eventTimeToDisplay = "";
        console.log(eventTime);

        if(eventTime){
            eventTimeToDisplay = eventTime.split("-")[0];
        }

        if(parseInt(event.eventDays) > 1 && typeof event.eventEndDate !== 'undefined'){
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

        li.classList += `swp-upcoming-event-${iter}`;
        div.classList += `swp-list-date`;
        spanDate.classList += 'swp-list-day-month';
        spanDate.innerHTML = dayMonth;
        spanYear.classList += 'swp-list-year';
        
        divEvent.classList += "swp-list-title";
        aElm.setAttribute("href", event.permalink);
        aElm.innerText = event.title;

        div.appendChild(spanDate);
        if(eventTime && parseInt(event.eventDays) === 1){
            spanYear.classList.add("time");
            spanYear.innerText = eventTimeToDisplay;
            div.appendChild(spanYear);
        } else if(!yearFits){
            spanYear.innerText = year;
            div.appendChild(spanYear);
        } 
            
        // div.appendChild(spanYear);
        divEvent.appendChild(aElm);

        li.appendChild(div);
        li.appendChild(divEvent);

        return li;
    },

    /**
     * @todo zbytečně nepřidávat podruhé ty listenery
     * @todo možná půjde odstranit oprava proti zdvojování kalendáři v userovi!
     */
    getCalendar () {
        this.mainElm.setAttribute("id", "calendar");
        this.daysElm.setAttribute("class", "days");

        // Skládání kalendáře dohromady - oprava zdvojování kalendáře po zavření apod.
        if(!this.mainElm.querySelector("div.month")) this.mainElm.appendChild(this.createHeaderMonth());
        if(!this.mainElm.querySelector("#swp-cal-weekdays")) this.mainElm.appendChild(this.createHeaderWeekdays());
        if(!this.mainElm.querySelector("ul.days")) this.mainElm.appendChild(this.getWeeks());
        
        this.mainElm.querySelector("#calendar li.next").addEventListener("click", this);
        this.mainElm.querySelector("#calendar li.prev").addEventListener("click", this);

        return;
    },

    run () {
        this.getMonths(this.relMonth);

        if(this.anchorList){
            // console.log("zaciname");
            this.getListPlaceholder(this.listNumEvents);
        }

        if(this.anchorMiniCal) {
            this.getCalendar();       
            this.anchorMiniCal.appendChild(this.mainElm);     
        }
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
    // toto by šlo přepsat lépe, ale podle toho můžu backendově filtrovat pouze "tento" měsíc, opakující se a vícedenní a tím si posílat míň dat
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
     * Renderování přijatých dat
     * @param {object} result 
     * @todo Prakticky celý předělat
     */
    const resultCallback = (result) => {
        const events = JSON.parse(result);
        
        console.log(events);

        // Renderování malého kalendáře
        if(swpCal.anchorMiniCal){
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

        // Renderování planneru
        /**
         * if - planer placement je na místě
         * @todo: checknout, jestli to náhodou už není vyrenderované
         */
        if(swpCal.anchorList){
            // render result to placeholders
            if(!swpCal.listRendered) swpCal.renderList(events, swpCal.listNumEvents);
        }

    }
}

const setEventListeners = () => {
    if(swpCal.anchorMiniCal){
        document.querySelector("#calendar li.next").addEventListener("click", ajax);
        document.querySelector("#calendar li.prev").addEventListener("click", ajax);
    }
}

// Pokud jsem v admin módu, toto se nevykoná
if(swpCal.anchorList || swpCal.anchorMiniCal){
    document.addEventListener("DOMContentLoaded", setEventListeners);
    document.addEventListener("DOMContentLoaded", ajax);
}

swpCal.run(); 

// export { swpCal };