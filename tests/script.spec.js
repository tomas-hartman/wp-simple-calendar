import swpCal from '../js/script';
// console.log(swpCal);


test('createMonthTitle', () => {
    const date = new Date("2019-11-30");
    const output = swpCal.createMonthTitle(date);

    expect(output).toBe('listopad 2019');
});

test("getDateString", () => {
    const date1 = new Date("2019-11-30"); // případ s novým datem
    const date2 = "2019-05-30"; // getDateString: date, date, jednociferný měsíc
    const date3 = "12.5.2005"; // getDateString: date, string
    const date4 = "2019-11-30";
    
    const output1 = swpCal.getDateString(date1);
    const output2 = swpCal.getDateString(date2);
    const output3 = swpCal.getDateString(date3);
    const output4 = swpCal.getDateString(date4);

    expect(output1).toBe('2019-11-30');
    expect(output2).toBe('2019-05-30');
    expect(output3).toBe('2005-12-05');
    expect(output4).toBe('2019-11-30');
});

test('createHeaderWeekdays', () => {
    const output = swpCal.createHeaderWeekdays();
    const id = output.getAttribute("id");

    expect(output instanceof HTMLElement).toBeTruthy();
    expect(output.querySelectorAll("li").length).toBe(7);
    expect(id).toBe("swp-cal-weekdays");
    expect(output.classList.contains("weekdays")).toBeTruthy();
});

test("createHeaderMonth", () => {
    const output = swpCal.createHeaderMonth();
    const elmClassList = output.classList;

    expect(output instanceof HTMLElement).toBeTruthy();
    expect(elmClassList.contains("month")).toBeTruthy();
    expect(output.querySelectorAll("li").length).toBe(3);
});

test("createElm", () => {
    const testSet = [[], ["",""], ["16", ""], [15, ""], [25], [3]];
    const expectedIds = ["", "day-0", "day-16", "day-15", "day-25", "day-03"]; // day-0 je chyba
    const output = [];
    
    testSet.forEach((params) => {
        let elm = swpCal.createElm(...params);
        try{
            output.push(elm.firstChild.getAttribute("id"));
        }
        catch(e){
            output.push("");
        }
        
    });

    for(let i=0;i<expectedIds.length;i++){
        expect(output[i]).toBe(expectedIds[i]);
    }
});

test("createElm: today, HTMLElement", () => {
    const today = (new Date()).getDate();
    const output = swpCal.createElm(today);
    const todayString = () => today.toString().length < 2 ? `0${today.toString()}` : today.toString() ;
    let expectedId = `day-${todayString()}`;

    const realId = output.firstChild.getAttribute("id");

    expect(output instanceof HTMLElement).toBeTruthy();
    expect(realId).toBe(expectedId);
    expect(output.firstChild.classList.contains("active")).toBeTruthy();
});

// todo: createTooltip, createEventElm --> přepsat! + důležitý!, getWeeks, createListItem 