const factorial=require('./factorial');

test('calculate factorial of a number', () => {
    expect(factorial(5)).toBe(120);
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(3)).toBe(6);
});