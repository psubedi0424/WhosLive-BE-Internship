# Week2 Day1
---
# Goal
Set up an Express server connected to MongoDB (local or Docker), test API routes, and prepare the base project for further development.

---
# What I did
-Configured Express server
-Setup mongo db connection
- configured docker for mongodb
```bash
docker run -d \
  -p 27017:27017 \
  --name intern-mongo \
  mongo:6
```
---
# Run the server
```bash
npm run dev
```
