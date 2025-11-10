const maxInArray = require('./maxInArray');
test('find max in array', () => {
    expect(maxInArray([1, 2, 3, 10, 100])).toBe(100);
});
