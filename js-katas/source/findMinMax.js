function findMinMax(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { min, max };
}
module.exports = findMinMax;
