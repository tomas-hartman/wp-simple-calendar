import swpCal from '../js/script';
    console.log(swpCal);


test('aaa', () => {
    const date = new Date("2019-11-30");
    const output = swpCal.createMonthTitle(date);

    expect(output).toBe('listopad 2019');
});

test("getDateString", () => {
    const date = new Date("2019-11-30");
    const output = swpCal.getDateString(date);

    expect(output).toBe('2019-11-30');
});

test("getDateString: date, date, jednociferný měsíc", () => {
    const date = new Date("2019-05-30");
    const output = swpCal.getDateString(date);

    expect(output).toBe('2019-05-30');
});

test("getDateString: date, string", () => {
    const date = "12.5.2005";
    const output = swpCal.getDateString(date);

    expect(output).toBe('2005-12-05');
});