const mergeObjects = require('./mergeObjects');
test('merge two objects', () => {
    expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
});
