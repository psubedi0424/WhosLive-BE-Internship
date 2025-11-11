async function abcd() {
    console.log('Hello');
    await Promise.resolve();
    console.log('World 1');
}
abcd();
console.log('World 2 ');

//output

// node async_await.js
// Hello
// World 2 
// World 1