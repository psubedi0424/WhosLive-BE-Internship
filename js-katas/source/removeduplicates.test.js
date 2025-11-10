const remove_duplicates = require('./removeduplicates');

test('removes duplicates from an array', () => {
    expect(remove_duplicates([1, 2, 2, 3, 4, 4])).toEqual([1, 2, 3, 4]);
    expect(remove_duplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    expect(remove_duplicates([])).toEqual([]);
    expect(remove_duplicates([1, 1, 1, 1])).toEqual([1]);
});