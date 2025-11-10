const isPalindrome  = require('./isPalindrome');
test('detects palindrome strings', () => {
    expect(isPalindrome('Racecar')).toBe(true);
});
