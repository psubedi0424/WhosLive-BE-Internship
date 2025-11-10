const is_even = require('./is_even');

test('is true for even numbers', () => {
    expect(is_even(2)).toBe(true);
    expect(is_even(-1)).toBe(false);
    expect(is_even(-4)).toBe(true);
});