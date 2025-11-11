# 🚀 Day 2 — Async & Event Loop (BE Internship)
 
##  Topic: JavaScript Event Loop, Async Behavior & Microtasks

---
## Overview
On Day-2 I explored about how Javascript handles asynchronous code execution using the event loop.
JavaScript runs in a **single thread**, so it executes one line at a time — but with help from **callback queues**, **microtask queues**, and the **event loop**, it can manage multiple async tasks efficiently without blocking execution.

This concept is essential for understanding how Node.js handles **I/O operations**, **Promises**, and **async/await** behind the scenes.
---
## What I Learned
 **Difference between synchronous and asynchronous code** .
 **How the Event Loop works**
 **Microtasks** and **Macrotasks**
 **callbacks, Promises, async/await**
 Differentiate between `setTimeout`, `setImmediate`, and `process.nextTick`

---
 | Concept | Explanation |
|----------|--------------|
| **Call Stack** | Where JS executes code line-by-line |
| **Callback Queue (Macrotask)** | Stores tasks like `setTimeout`, `setImmediate`, and I/O callbacks |
| **Microtask Queue** | Stores Promises and `process.nextTick()` — runs before macrotasks |

---