// scripts/seed.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../db.js";

import { Creator } from "../models/creator.models.js";
import { Category } from "../models/category.models.js";
import { Stream } from "../models/stream.models.js";

const seed = async () => {
    try {
        await connectDB();

        console.log("Clearing old data...");
        await Creator.deleteMany({});
        await Category.deleteMany({});
        await Stream.deleteMany({});

        console.log("Inserting categories...");
        const categories = await Category.insertMany([
            { title: "Gaming", slug: "gaming" },
            { title: "Music", slug: "music" },
            { title: "Education", slug: "education" },
            { title: "Just Chatting", slug: "just-chatting" },
        ]);

        console.log("Inserting creators...");
        const creators = await Creator.insertMany([
            {
                name: "TechWithTim",
                username: "techwithtim",
                email: "tim@example.com",
                platform: "youtube",
                platformCreatorId: "yt_techwithtim_001",
                followers: 500000,
                avatar: "https://example.com/tim.jpg"
            },
            {
                name: "GamingQueen",
                username: "gamingqueen",
                email: "gq@example.com",
                platform: "twitch",
                platformCreatorId: "tw_gamingqueen_001",
                followers: 150000,
                avatar: "https://example.com/gq.jpg"
            },
        ]);


        console.log("Inserting streams...");
        await Stream.insertMany([
            {
                title: "Learning MongoDB",
                description: "Deep dive into indexes",
                platform: "youtube", // Required field - must be "youtube" or "twitch"
                platformStreamId: "yt_stream_mongo_001", // Required field - must be unique
                creator: creators[0]._id,
                category: categories[2]._id, // Education
                isLive: true,
                viewerCount: 1200,
                startedAt: new Date(),
            },
            {
                title: "Valorant Tournament",
                description: "Ranked livestream",
                platform: "twitch", // Required field - must be "youtube" or "twitch"
                platformStreamId: "tw_stream_valorant_001", // Required field - must be unique
                creator: creators[1]._id,
                category: categories[0]._id, // Gaming
                isLive: false,
                viewerCount: 850,
                startedAt: new Date(Date.now() - 3600 * 1000),
            },
            {
                title: "Node.js Advanced Patterns",
                description: "Streams and buffers deep dive",
                platform: "youtube",
                platformStreamId: "yt_stream_node_001",
                creator: creators[0]._id,
                category: categories[2]._id, // Education
                isLive: true,
                viewerCount: 950,
                startedAt: new Date(),
            },
            {
                title: "Fortnite Friday",
                description: "Weekly tournament",
                platform: "twitch",
                platformStreamId: "tw_stream_fortnite_001",
                creator: creators[1]._id,
                category: categories[0]._id, // Gaming
                isLive: true,
                viewerCount: 1200,
                startedAt: new Date(),
            },
            {
                title: "Music Production Live",
                description: "Making beats in real-time",
                platform: "youtube",
                platformStreamId: "yt_stream_music_001",
                creator: creators[0]._id,
                category: categories[1]._id, // Music
                isLive: false,
                viewerCount: 300,
                startedAt: new Date(Date.now() - 7200 * 1000),
            }
        ]);

        console.log("Seeding complete!");
        process.exit(0);

    } catch (err) {
        console.error("SEED ERROR:", err);
        process.exit(1);
    }
};

seed();