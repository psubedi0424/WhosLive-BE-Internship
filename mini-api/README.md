# WhosLive – Week 3 Day 2  
---
### Ingestion Module + Streams Module + Redis Queue + MongoDB Upsert

The ingestion pipeline for Twitch and YouTube streams using:
- Bull Queue (Redis)
- NestJS Modules
- MongoDB with idempotent upserts
- Proper background worker processing
---
##  What I Worked on:

### 1. **Ingestion Module**
- `/ingest/all` (GET + POST) endpoints added.
- IngestService fetches:
  - Twitch Live Streams
  - YouTube Live Streams  
- Pushes both datasets into a Bull Queue (`ingest` queue).
- Configured retry + exponential backoff.

### 2. **Bull Queue Integration**
- Redis is used as the job broker.
- IngestProcessor runs with concurrency = 5.
- Each job processes streams and upserts them to MongoDB.

### 3. **Idempotent Upsert**
- No duplicates
- Re-running ingestion does NOT increase document count
- Verified using Node REPL inside the container