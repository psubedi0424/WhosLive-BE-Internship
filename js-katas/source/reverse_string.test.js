const reverse_string = require('./reverse_string');

test('reverses a given string', () => {
    expect(reverse_string('hello')).toBe('olleh');
    expect(reverse_string('')).toBe('');
    expect(reverse_string('A')).toBe('A');
    expect(reverse_string('racecar')).toBe('racecar');
});