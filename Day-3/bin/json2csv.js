import fs from 'fs';
import { Transform } from 'stream';
import { pipeline } from "stream";

const argument = process.argv.slice(2);
if (argument.length < 2) {
    console.error('Usage: node json2csv.js <input.json> <output.csv>');
    process.exit(1);        
}

const [inputFile, outputFile] = argument;

const inputStream = fs.createReadStream(inputFile, { encoding: 'utf8', highWaterMark: 64 * 1024 });


const outputStream = fs.createWriteStream(outputFile, { encoding: 'utf8' });

let headers = null;

const jsonToCsv = new Transform({
    readableObjectMode: false,
    writableObjectMode: false,
    transform(chunk, encoding, callback) {
        const lines = chunk.toString().split("\n");

        for (const line of lines) {
            if (!line.trim()) continue;

            const obj = JSON.parse(line);

            if (!headers) {
                // first object defines CSV columns
                headers = Object.keys(obj);
                this.push(headers.join(",") + "\n");
            }

            const row = headers.map(h => obj[h] ?? "").join(",");
            this.push(row + "\n");
        }

        callback();
    }
});


pipeline(
    inputStream,
    jsonToCsv,
    outputStream,
    (err) => {
        if (err) {
            console.error("Pipeline failed:", err);
            process.exit(1);
        }
        console.log("✅ Conversion complete!");
    }
);



// let leftover = "";

// const jsonToCsv = new Transform({
//     transform(chunk, encoding, callback) {
//         const text = leftover + chunk.toString();
//         const lines = text.split("\n");
//         leftover = lines.pop() || ""; // last item may be partial -> keep for next chunk
//         for (const line of lines) { ... } // only complete lines
//     callback();
//   },
// flush(callback) {
//     if (leftover.trim()) {
//         // parse final line or emit an error if malformed
//     }
//     callback();
// }
// });



// let obj;
// try {
//     obj = JSON.parse(line);
// } catch (err) {
//     console.error("Skipping invalid JSON line:", line);
//     continue; // skip this line and move to the next
// }

