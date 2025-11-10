const longestWord  = require('./longestWord');
test('returns the longest word', () => {
    expect(longestWord('Hello Prashant')).toBe('Prashant');
});
