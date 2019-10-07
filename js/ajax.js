document.addEventListener("DOMContentLoaded", () => {
    
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
            console.log(result);
        }
    };
    
    xhr.send(data);     

    /**
     * MOCKUP Funkce
     * @param {object} result 
     */
    const resultCallback = (result) => {
        const events = JSON.parse(result);
        const thisMonth = "10";
        console.log(JSON.parse(result));

        events.forEach(event => {
            const date = event.eventDate.split("-");
            if(date[1] === thisMonth){
                console.log(date[2]);

                let elm = document.querySelector(`#swp-cal-mini-main #calendar .days #day-${date[2]}`);
                console.log(elm);
                // elm.setAttribute("class", "event");
                elm.classList += " event";
            }
            console.log(date);
        });
    }

    // return false;
});