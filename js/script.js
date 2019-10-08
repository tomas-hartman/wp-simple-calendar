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
        year: 2019,
        month: 10,
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
        let thisMonth = swpCal.displayedMonth.toString();

        if(thisMonth.length < 2) {
            thisMonth = `0${thisMonth}`;
        }
        
        console.log(JSON.parse(result));

        events.forEach(event => {
            const date = event.eventDate.split("-");
            if (date[1] === thisMonth) {
                const a = document.createElement("a");
                const span = document.createElement("span");
                
                a.setAttribute("href", event.permalink);
                a.innerText = event.title;

                span.classList.add("day-events");
                span.appendChild(a);

                // console.log(date[2]);
                let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);
                // console.log(elm);
                // elm.setAttribute("class", "event");
                elm.classList.add("event");
                elm.classList.add("tooltip");

                elm.appendChild(span);
            }
            // console.log(date);
        });
    }
}

const setEventListeners = () => {
    document.querySelector("#calendar li.next").addEventListener("click", ajax);
    document.querySelector("#calendar li.prev").addEventListener("click", ajax);
}

document.addEventListener("DOMContentLoaded", setEventListeners);
document.addEventListener("DOMContentLoaded", ajax);

swpCal.run();