process.nextTick(() => console.log('nextTick'));
setImmediate(() => console.log('setImmediate'));
console.log('start');

//output
// node nexttick_vs_setimmediate.js
// start
// nextTick
// setImmediate



// order of execution
// Synchronous → process.nextTick → Promises → Timers(setTimeout)