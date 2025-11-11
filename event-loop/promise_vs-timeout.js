console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promise'));

console.log('End');


// node promise_vs_timeout.js
// Start
// End
// Promise
// Timeout