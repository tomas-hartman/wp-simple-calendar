const run = () => {
    const weekdayNames = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
    const monthNames = ["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"];

    const anchor = document.getElementById("swp-cal-mini-main");
    const mainElm = document.createElement("div");
    const daysElm = document.createElement("ul");
    const today = new Date();
    
    let relMonth = 0;
    let firstDayOfMonth;
    let firstDayOfNextMonth;
    let numOfDays; 
    let daysArr = [];

    /**
     * Helper funkce. Nastavuje základní proměnné pro jednotlivé funkce podle relativního měsíce.
     * @access init, refreshData()
     * @param {number} relMonth Konstanta s relativním počtem měsíců vůči dnešku
     * @var firstDayOfMonth První den daného měsíce
     * @var firstDayOfNextMonth První den následujícího měsíce
     * @var numOfDays Počet dní v měsíci
     * @var daysArr Pomocné pole s daty jednotlivých dnů v měsíci 
     */
    const getMonths = (relMonth) => {
        firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() + relMonth);
        firstDayOfNextMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1);
        numOfDays = Math.floor((firstDayOfNextMonth - firstDayOfMonth) / (1000*60*60*24)); // při přeměně času na zimní může mít jiný počet hodin
        daysArr = [];

        for(let i = 1;i<=numOfDays;i++){
            daysArr.push(i);
        }
    }
    getMonths(relMonth);

    mainElm.setAttribute("id","calendar");
    daysElm.setAttribute("class","days");

    const createHeaderWeekdays = () => {
        
        const ulWeekdays = document.createElement("ul");
        
        ulWeekdays.setAttribute("class", "weekdays");

        for(let i=0;i<7;i++){
            let elm = document.createElement("li");
            elm.innerText = weekdayNames[i];

            ulWeekdays.appendChild(elm);
        }
        return ulWeekdays;
    }

    /**
     * Pomocná funkce pro createHeaderMonth()
     * @access refreshData() a init generování kalendáře
     * @param {Date} firstDayOfMonth 
     */
    const createMonthTitle = (firstDayOfMonth) => {
        const month = monthNames[firstDayOfMonth.getMonth()];
        const year = firstDayOfMonth.getFullYear();

        return `${month} ${year}`;
    }

    const createHeaderMonth = () => {
        const divMonth = document.createElement("div");
        divMonth.setAttribute("class", "month");

        divMonth.innerHTML = `
            <ul>
                <li class="prev">«</li>
                <li class="next">»</li>
                <li class="month-header">${createMonthTitle(firstDayOfMonth)}</li>
            </ul>
        `;

        return divMonth;
    } 

    /**
     * Pomocná funkce pro getWeeks() - nevolat samostatně!
     * Vytvoří mi elementy pro jednotlivé dny, včetně popisků a zvýraznění
     * @param {number} date číslo dne z kalendáře
     * @param {*} params Parametry k jednotlivým dnům, zejména popisky událostí
     * @todo
     */
    const createElm = (originDate, params) => {
        const elm = document.createElement("li");
        const span = document.createElement("span");
        let date = originDate;

        // Chci, aby datum v classe bylo ve formátu 05, 06 apod.
        if(typeof date !== "undefined" && date < 10){

            date = `0${originDate}`;
            console.log(date);
        }

        if(firstDayOfMonth.getMonth() === today.getMonth() && originDate === today.getDate()){
            // const todayElm = document.createElement("span");
            span.setAttribute("class", "active");
            span.setAttribute("id", `day-${date}`);
            span.innerText = originDate;
            elm.appendChild(span);

            return elm;
        }
        if(date){
            span.innerText = originDate;
            span.setAttribute("id", `day-${date}`);
            elm.appendChild(span);
        }
        if(params){
            // elm.appendChild(document.createElement("span"));
            // add more
        }
        return elm;
    }

    /**
     * Hlavní funkce
     * Vygeneruje strukturu kalendáře pro jednotlivé dny
     * @returns DOM s vytvořenými elementy pro jednotlivé dny
     * @access main generování kalendáře a refreshData()
     */
    const getWeeks = () => {
        const days = document.createElement("ul");
        days.setAttribute("class", "days");

        let firstWeekConst = false;
        let firstDay = firstDayOfMonth.getDay();

        if(firstDay === 0){ firstDay = 7 }

        while(daysArr.length > 0){
            for(let i=1;i<8;i++){
                if(i>=firstDay && !firstWeekConst){ // Následně už je jedno, jakou hodnotu má i, ale v první iteraci je to důležité
                    let daysArrItem = daysArr.shift();
                    firstWeekConst = true;

                    days.appendChild(createElm(daysArrItem)); // RENDER FULL
                    continue;
                }

                if(firstWeekConst && daysArr.length > 0){
                    let daysArrItem = daysArr.shift();

                    days.appendChild(createElm(daysArrItem)); // RENDER FULL
                    continue;
                }

                days.appendChild(createElm()); // RENDER EMPTY          
            }
        }
        console.log(days);
        return days;
    }

    // Skládání kalendáře dohromady 
    mainElm.appendChild(createHeaderMonth());
    mainElm.appendChild(createHeaderWeekdays());
    mainElm.appendChild(getWeeks());

    
    // Posouvání v kalendáři dopředu a dozadu a jeho refreshe //  
    const refreshData = (relMonth) => {
        const monthHeader = document.querySelector("#calendar li.month-header")

        getMonths(relMonth);
        monthHeader.innerHTML = createMonthTitle(firstDayOfMonth);
        mainElm.querySelector("ul.days").remove();   
        mainElm.appendChild(getWeeks());
    }

    const fcnNext = () => {
        relMonth += 1;
        refreshData(relMonth);
    }

    const fcnPrev = () => {
        relMonth -= 1;
        refreshData(relMonth);
    }

    anchor.appendChild(mainElm);

    document.querySelector("#calendar li.next").addEventListener("click", fcnNext);
    document.querySelector("#calendar li.prev").addEventListener("click", fcnPrev);
}

run();