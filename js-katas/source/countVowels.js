function countVowels(str) {
  const vowels = 'AEIOUaeiou';
  let count = 0;
  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

module.exports = countVowels;