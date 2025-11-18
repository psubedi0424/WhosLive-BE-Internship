// scripts/testIndexes.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Stream } from "../src/models/stream.model.js";
import { Creator } from "../src/models/creator.model.js";
import { connectDB } from "../src/db.js";

const testIndexes = async () => {
    try {
        console.log("🔍 Starting index tests...\n");

        await connectDB();
        console.log(" Connected to MongoDB\n");

        // -------------------------------
        // TEST 1 — Live streams by category
        // -------------------------------
        const sampleLive = await Stream.findOne({ isLive: true });

        if (!sampleLive) {
            console.log("⚠️ No live streams found. Seed first.");
            process.exit(0);
        }

        const explain1 = await Stream.find({
            isLive: true,
            category: sampleLive.category,
        }).explain("executionStats");

        console.log(" TEST 1: Live streams by category");
        console.log("   Index used:", explain1.executionStats.executionStages.inputStage?.indexName || "COLLSCAN");
        console.log("   Docs examined:", explain1.executionStats.totalDocsExamined);
        console.log("   Execution time (ms):", explain1.executionStats.executionTimeMillis);

        console.log("\n----------------------------------------\n");

        // -------------------------------
        // TEST 2 — Creator stream history
        // -------------------------------
        const sampleCreator = await Creator.findOne({});

        if (!sampleCreator) {
            console.log("⚠️ No creators found. Seed first.");
            process.exit(0);
        }

        const explain2 = await Stream.find({
            creator: sampleCreator._id,
        })
            .sort({ startedAt: -1 })
            .explain("executionStats");

        console.log(" TEST 2: Creator stream history");
        console.log("   Index used:", explain2.executionStats.executionStages.inputStage?.indexName || "COLLSCAN");
        console.log("   Docs examined:", explain2.executionStats.totalDocsExamined);
        console.log("   Execution time (ms):", explain2.executionStats.executionTimeMillis);

        console.log("\n✓ Index tests completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Error while testing indexes:", err);
        process.exit(1);
    }
};

testIndexes();
