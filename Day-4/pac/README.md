# Day 4 :Errors,Logging & Configuratiion

**Task:**Implement centralized error handling, structured logging, and environment-based configuration in a NestJS application.

---
## Objective:
- Learn how to handle errors in a **clean, consistent, and centralized** way.  
- Understand how to use **NestJS Filters** for exception management.  
- Implement **structured logging** using `nestjs-pino`.  
- Learn to organize app configuration using `@nestjs/config` and environment variables.

---

## Concepts Learned:
-Instead of handling errors inside each controller manually, a **global exception filter** was created to catch and format all exceptions consistently.
-Created reusable error types in app.errors.ts for cleaner code and consistent status codes.
-logginng using `nestjs-pino`

---
## What I achieved:
-Built a centralized error-handling system for clean and consistent responses.

-Implemented custom error classes for better structure.

-Added structured logging with nestjs-pino.

-Enabled environment-based configuration using @nestjs/config.

-Verified routes /ok, /fail, and /missing behave as expected.

---
``` bash
npm run start:dev

```

