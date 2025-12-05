// demo.js
import EventSource from 'eventsource';

console.log('🚀 Starting SSE demo...');

// Connect 3 clients
const clients = Array.from({ length: 3 }, (_, i) => {
  const es = new EventSource('http://localhost:3000/realtime/live');
  console.log(`Client ${i + 1} connected`);

  es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(`Client ${i + 1}:`, data);
  };

  es.onerror = (e) => {
    console.log(`Client ${i + 1} error:`, e.status);
  };

  return es;
});

// Simulate failures after 30s
setTimeout(() => {
  console.log('💥 Simulating provider failures...');
  // You'd need to mock StreamsService to fail
}, 30000);

// Run for 5 minutes
setTimeout(() => {
  console.log(' 5-minute soak test complete');
  clients.forEach((es) => es.close());
  process.exit(0);
}, 5 * 60 * 1000);
