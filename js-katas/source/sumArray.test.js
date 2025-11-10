const sumArray = require('./sumarray');
test('calculates sum of an array', () => {
    expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    expect(sumArray([-1, -2, -3, -4, -5])).toBe(-15);
    expect(sumArray([0, 0, 0, 0, 0])).toBe(0);
    expect(sumArray([1.5, 2.5, 3.5])).toBe(7.5);
});