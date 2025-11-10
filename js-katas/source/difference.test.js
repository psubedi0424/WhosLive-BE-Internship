const difference  = require('./difference');
test('returns elements not in second array', () => {
    expect(difference([1, 2, 3], [2, 3])).toEqual([1]);
});
