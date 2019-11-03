// import { swpCal } from "./script.js";

swpCal.adminGetCalendar = function (ev) {
    const existingDatepicker = document.querySelector(".tooltip .datepicker");
    if(!existingDatepicker /**|| !existingDatepicker.contains(ev.target)  element na kterej kliknu není jeho parentem */){
        
        const tooltip = this.createTooltip(ev.target.parentElement, 270);
              tooltip.innerText = ev.target.value || "2019-10-12";
              tooltip.classList.add("datepicker");
        const calendarContainer = document.createElement("div");
              calendarContainer.setAttribute("id", "swp-cal-mini-main");

        // RESET:
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
        document.onclick = (innerEv) => {
            const datepicker = document.querySelector(".tooltip .datepicker");
            if(datepicker && datepicker.parentNode && !datepicker.parentNode.contains(innerEv.target)){ 
                // RESET a Autoclose:
                datepicker.parentNode.classList.remove("tooltip");
                datepicker.parentNode.classList.remove("event");
                datepicker.remove();
                this.relMonth = 0;
                this.mainElm = document.createElement("div");
            }
        }
    }
};

swpCal.adminGetNumDays = function () {
    if(document.querySelector("#swp-cal-event-date-end").disabled) return;

    const numOfDaysElm = document.querySelector("#swp-cal-event-num-days");
    const eventStartElement = document.querySelector("#swp-cal-event-date");
    const eventEndElement = document.querySelector("#swp-cal-event-date-end");

    let diff = new Date(eventEndElement.value) - new Date(eventStartElement.value);
    let yearMs = 24*60*60*1000;
    let daysOffset = Math.floor(diff/yearMs) + 1; // rozdíl ve dnech - rozbíjelo by týdenní rozestupy

    numOfDaysElm.innerText = daysOffset;
}

/**
 * @todo refaktor!
 * @param {MouseEvent} ev 
 */
swpCal.handleAdminEvents = function (ev) {
    switch (ev.target.getAttribute("id")) {
        case "swp-cal-event-date":
            this.adminGetCalendar(ev);

            ev.target.addEventListener("focusout", () => {
                this.adminGetNumDays();
            }, {once: true});

            break;

        case "swp-cal-event-date-end":
            if(document.querySelector("#swp-cal-event-date-end").disabled) break;
            this.adminGetCalendar(ev);

            ev.target.addEventListener("focusout", () => {
                this.adminGetNumDays();
            }, {once: true});

            break;

        case "swp-cal-event-time":
            console.log(ev.target.value);

            break;

        case "swp-cal-event-date-end-chck":
            console.log(ev.target.checked);
            const eventEndElement = document.querySelector("#swp-cal-event-date-end");
            const eventStartElement = document.querySelector("#swp-cal-event-date");
            const numOfDaysElm = document.querySelector("#swp-cal-event-num-days");

            if(ev.target.checked){
                
                const initialDate = new Date();
                      initialDate.setDate(new Date(eventStartElement.value).getDate() + 1);
                const valueDate = this.getDateString(initialDate); 

                console.log(valueDate);
                eventEndElement.disabled = false;
                eventEndElement.value = valueDate;
                numOfDaysElm.innerText = 2;
            } else {
                eventEndElement.disabled = true;
                eventEndElement.value = "";
                numOfDaysElm.innerText = 1;
            }

            break;
    
        default:
            // console.log("klikls mimo");
            break;
    }
    // console.log(ev);
}

/**
 * @todo Upravit, aby se nerenderovalo x-krát, možná upravit, aby se vytvářelo přes PHP
 */
swpCal.adminValidationErr = function(text, origin, renderFrame = true) {
    const placeholder = document.querySelector(".wp-header-end");
    const btn = `<button type="button" class="notice-dismiss"><span class="screen-reader-text">Skrýt toto upozornění.</span></button>`;
    const messageDiv = document.createElement("div");
          messageDiv.id = "message";
          messageDiv.classList += "notice notice-error is-dismissible";
    
    const errorMsgUl = document.createElement("ul");
    const errorMsg = document.createElement("li");
          errorMsg.classList.add("error");
          errorMsg.innerText = text;
          
          errorMsgUl.appendChild(errorMsg);
          messageDiv.appendChild(errorMsgUl);
    
    
          placeholder.parentNode.insertBefore(messageDiv,placeholder.nextSibling)

    if(!renderFrame) return;
    origin.style.borderColor = "#a00";
    origin.style.backgroundColor = "rgba(170, 0, 0, 0.1)";
}

swpCal.adminValidate = function(el) {
    const eventEndElement = document.querySelector("#swp-cal-event-date-end");
    const eventStartElement = document.querySelector("#swp-cal-event-date");
    const numOfDaysElm = document.querySelector("#swp-cal-event-num-days");
    const hoursElement = document.querySelector("#swp-cal-event-time");
    const titleElement = document.getElementsByName("post_title")[0];
    const errorMessage = document.querySelector("#validate ul");
          errorMessage.innerHTML = "";

    const regexYear = /(\d{4}-(0\d|(10|11|12))-(0[1-9]|[1-2]\d|(30|31)))|(^$)/g;
    const regexHour = /((\D\d|1\d|2[0-3]):[0-5]\d-(\d{1}|1\d|2[0-3]):[0-5]\d|(\D\d|1\d|2[0-3]):[0-5]\d)|(^$)/g;

    if(titleElement.value.trim() === "") {
        const text = "Vyplňte nadpis události.";
        this.adminValidationErr(text, titleElement);
        el.preventDefault();
    }

    if(!eventStartElement.value.match(regexYear)){
        const text = "Datum události je ve špatném formátu.";
        this.adminValidationErr(text, eventStartElement);
        el.preventDefault();
    } 

    if(!eventEndElement.disabled && !eventEndElement.value.match(regexYear)){
        const text = "Datum konce události je ve špatném formátu.";
        this.adminValidationErr(text, eventEndElement);
        el.preventDefault();
    } 

    if(numOfDaysElm.innerText === "NaN" || parseInt(numOfDaysElm.innerText) < 1) {
        const text = "Počet dní je neplatný. Událost nemůže končit v minulosti.";
        this.adminValidationErr(text, numOfDaysElm, false);
        el.preventDefault();
    }

    if(!hoursElement.value === "" || !hoursElement.value.match(regexHour)){
        const text = "Čas události je ve špatném formátu.";
        this.adminValidationErr(text, hoursElement);
        el.preventDefault();
    } 
}

// Pokud jsem v admin módu, vykoná se toto
if(swpCal.anchorAdminMetabox){
    swpCal.anchorAdminMetabox.onclick = function(ev){
        swpCal.handleAdminEvents(ev);
    }
    document.querySelector("#publish").addEventListener("click", (el) => {
        swpCal.adminValidate(el);
    });
}