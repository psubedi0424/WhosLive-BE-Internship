const capitalizeWords = require('./capitalizeWord');
test('capitalizes each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
});
