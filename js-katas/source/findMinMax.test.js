const findMinMax =require('./findMinMax')
test('find min and max in array', () => {
    expect(findMinMax([1, 2, 3, 10, 100])).toEqual({ min: 1, max: 100 });
});
