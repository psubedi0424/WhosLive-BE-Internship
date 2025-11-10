const removeFalsyValues = require('./removeFalsy');
test('removes falsy values', () => {
    expect(removeFalsyValues([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]);
});
