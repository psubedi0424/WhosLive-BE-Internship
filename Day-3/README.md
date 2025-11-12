## Day-3:Stream & Backpressure
---
## Plan :

- Understand Node.js streams and implement a CLI tool to convert large json file to CSV using stream.
-Learn what streams are and how they enable efficient data handling in Node.js.
-Understand the concept of backpressure and how to manage it in a data pipeline.
-Build a CLI tool using Readable, Transform, and Writable streams.
-Process large files (100 MB+) without running out of memory.

---
## Concepts Learned
-Stream:
    Load data piece by piece instead of loading all data at once.
    **Readable** – provides data (e.g., reading a file).  
    **Writable** – receives data (e.g., writing a file).  
    **Transform** – reads input, modifies it, and pushes the result downstream.

```js
import { Readable, Writable, Transform } from 'stream';
```
---
-BackPressure:
    Backpressure in JavaScript, particularly within Node.js, refers to a mechanism for managing the flow of data between a readable stream and a writable stream when the readable stream produces data faster than the writable stream can consume it. Its a crucial concept for preventing memory exhaustion and ensuring efficient data processing in stream-based applications.

---
## ▶️ Run Command

To convert a JSON file to CSV using the CLI tool, run:

```bash
node bin/jsontocsv2.js fixtures/searchspring.json output3.csv
```
-fixtures/searchspring.json → input JSON file

-output3.csv → output CSV file generated after conversion


    
