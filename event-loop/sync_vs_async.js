console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
console.log('4');
setTimeout(() => console.log('5'), 0);
console.log('6');

// Output order:
// 1
// 3
// 4
// 6
// 2
// 5