# Day 5 — HTTP Basics & Testing (NestJS + Supertest)
    -Learn HTTP fundamentals and write automated integration (E2E) tests using Jest + Supertest.

---
## What I did Today.

1.Created a small NESTJS project.
This project contains three basic HTTP routes meant to teach:
Status codes
Exception handling
Testing with Supertest
2. Implemented 3 routes:
-/ok
-/fail
-/missing

3. Ran the test
```bash
    npm run test:e2e
```
4. Prepared the coverge report
    -For coverage report
```bash
    npm run test:e2e -- --coverage
    OR
    npm run test:coverage
```
---
## How to run the project
-Start app:
``` bash
    npm run start:dev
```
-Run E2E test:
``` bash
    npm run test:e2e
```
