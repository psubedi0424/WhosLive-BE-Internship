# WEEK-2 DAY-4
---
Today’s goal was to add security, validation, sanitization, and perform basic fuzz testing on the Stream API.
---
Adding Helmet for HTTP header security

Adding Rate Limiting

Adding Input Sanitization (prevent NoSQL injection)

Adding Zod validation using schema middleware

Fixing .env issues and ensuring DB connects

Running fuzz test payloads
----
# What I did today:
-Implemented a security middleware
-Added Input Validation (Zod)
-Fixed express-mongo-sanitize crash
-Added Seed Script
---
# Run the code
-Seed the db
```bash
npm run seed
```
-Run the server
```bash
npm run seed
```