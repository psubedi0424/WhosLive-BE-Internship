function longestWord(str) {
    const words = str.split(' ');
    return words.reduce((a, b) => (b.length > a.length ? b : a), '');
}
module.exports = longestWord;
