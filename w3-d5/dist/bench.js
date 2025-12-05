"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autocannon_1 = require("autocannon");
const BASE = 'http://localhost:3000';
async function run(name, url) {
    console.log('Running', name, url);
    const result = await (0, autocannon_1.default)({
        url,
        duration: 10,
        connections: 50,
    });
    console.log(JSON.stringify({
        name,
        rps: result.requests.average,
        p95: result.latency.p95,
    }, null, 2));
}
(async () => {
    await run('baseline-heavy', `${BASE}/stats/heavy`);
    await run('cached-heavy', `${BASE}/stats/heavy-cached`);
})();
//# sourceMappingURL=bench.js.map