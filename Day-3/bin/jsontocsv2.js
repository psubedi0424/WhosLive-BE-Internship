import fs from 'fs';
import { Transform } from 'stream';
import { pipeline } from "stream/promises";

const argument = process.argv.slice(2);
if (argument.length < 2) {
    console.error('Usage: node json2csv.js <input.json> <output.csv>');
    process.exit(1);
}

const [inputFile, outputFile] = argument;

const inputStream = fs.createReadStream(inputFile, { encoding: 'utf8', highWaterMark: 1024 * 1024 });
const outputStream = fs.createWriteStream(outputFile, { encoding: 'utf8' });

let headers = null;
let buffer = '';

const jsonToCsv = new Transform({
    readableObjectMode: false,
    writableObjectMode: false,
    transform(chunk, encoding, callback) {
        buffer += chunk.toString();

        // Try as JSON array first
        if (buffer.trim().startsWith('[')) {
            try {
                const data = JSON.parse(buffer);
                if (Array.isArray(data)) {
                    for (const obj of data) {
                        if (!headers) {
                            headers = Object.keys(obj);
                            this.push(headers.join(",") + "\n");
                        }
                        const row = headers.map(h => obj[h] ?? "").join(",");
                        this.push(row + "\n");
                    }
                    buffer = '';
                    return callback();
                }
            } catch {
                // If parsing fails, wait for more data
                return callback();
            }
        }

        // Otherwise process as NDJSON
        const lines = buffer.split("\n");
        buffer = lines.pop() || ''; // Keep last incomplete line

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const obj = JSON.parse(line);

                if (!headers) {
                    headers = Object.keys(obj);
                    this.push(headers.join(",") + "\n");
                }

                const row = headers.map(h => obj[h] ?? "").join(",");
                this.push(row + "\n");
            } catch (error) {
                // Skip malformed JSON lines
                console.warn('Skipping invalid JSON:', line);
            }
        }

        callback();
    },

    flush(callback) {
        // Process any remaining buffer content
        if (buffer.trim()) {
            const lines = buffer.split("\n").filter(line => line.trim());
            for (const line of lines) {
                try {
                    const obj = JSON.parse(line);
                    if (!headers) {
                        headers = Object.keys(obj);
                        this.push(headers.join(",") + "\n");
                    }
                    const row = headers.map(h => obj[h] ?? "").join(",");
                    this.push(row + "\n");
                } catch (error) {
                    console.warn('Skipping invalid JSON in flush:', line);
                }
            }
        }
        callback();
    }
});


pipeline(
    inputStream,
    jsonToCsv,
    outputStream
).then(() => {
    console.log("✅ Conversion complete!");
}).catch((err) => {
    console.error("Conversion failed:", err);
    process.exit(1);
});