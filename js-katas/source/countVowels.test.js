const countVowels= require('./countVowels')

test('counts vowels in a string', () => {
    expect(countVowels('hello')).toBe(2);
    expect(countVowels('')).toBe(0);
    expect(countVowels('A')).toBe(1);
    expect(countVowels('racecar')).toBe(3);
});