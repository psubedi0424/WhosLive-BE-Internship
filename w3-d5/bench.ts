// bench.js
import autocannon from 'autocannon';

const BASE = 'http://localhost:3000';

async function run(name, url) {
  console.log('Running', name, url);
  const result = await autocannon({
    url,
    duration: 10,
    connections: 50,
  });
  console.log(
    JSON.stringify(
      {
        name,
        rps: result.requests.average,
        p95: result.latency.p95,
      },
      null,
      2,
    ),
  );
}

(async () => {
  await run('baseline-heavy', `${BASE}/stats/heavy`);
  await run('cached-heavy', `${BASE}/stats/heavy-cached`);
})();
