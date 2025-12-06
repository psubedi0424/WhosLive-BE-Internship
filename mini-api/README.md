## MINI-API
---
## Requirements:
* Node 20+
* Docker and Docker Compose
* Internet connection for build
---
### Installation:
```bash
git clone https://github.com/psubedi0424/WhosLive-BE-Internship.git
cd mini-api
npm install
```
---
### Run with Docker:
```bash
docker compose down
docker compose up --build
```
---
Services:
API → http://localhost:3000

MongoDB → localhost:27017

Redis → localhost:6379
---
## Endpoints


| Method | Endpoint   | Description                       |
| ------ | ---------- | --------------------------------- |
| GET    | `/streams` | List streams (cached)             |
| POST   | `/streams` | Upsert stream & invalidate caches |


Creators

| GET | /creators/:id/streams | Cached by creator |

Analytics

| GET | /analytics/now | Cached snapshot (with TTL) |

Realtime SSE

| GET | /realtime/live | Sends SSE every 5 seconds |
---
## Circuit Breaker

Provider API calls are protected with opossum.

Circuit:

Opens when 50% failures

Timeout: 3s

Reset: 10s

Fallback data always provided
---
## p95 benchmark
```bash 
npx autocannon -c 100 -d 20 http://localhost:3000/analytics/now
```
## SSE Test:
```bash
http://localhost:3000/realtime/live
```
-Should receive update every 5 seconds.
---
## Reset Everything:
```bash
docker compose down -v 
docker system prune -f
```
