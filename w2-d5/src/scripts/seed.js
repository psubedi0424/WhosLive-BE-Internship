import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../db.js";
import { Creator } from "../models/creator.model.js";
import { Category } from "../models/category.model.js";
import { Stream } from "../models/stream.model.js";

const seed = async () => {
    try {
        await connectDB();

        console.log("Clearing existing data...");
        await Creator.deleteMany({});
        await Category.deleteMany({});
        await Stream.deleteMany({});

        console.log("Seeding categories...");
        const categories = await Category.insertMany([
            { title: "Gaming", slug: "gaming" },
            { title: "Music", slug: "music" },
            { title: "Education", slug: "education" },
        ]);

        console.log("Seeding creators...");
        const creators = await Creator.insertMany([
            { name: "TechTim", username: "techtim", followers: 200000, platform: "youtube" },
            { name: "GameLord", username: "gamelord", followers: 140000, platform: "twitch" },
            { name: "EduPro", username: "edupro", followers: 80000, platform: "youtube" },
        ]);

        console.log("Seeding streams...");
        await Stream.insertMany([
            {
                title: "Node.js Live",
                creator: creators[0]._id,
                category: categories[2]._id,
                isLive: true,
                viewerCount: 1500,
            },
            {
                title: "Valorant Tournament",
                creator: creators[1]._id,
                category: categories[0]._id,
                isLive: true,
                viewerCount: 900,
            },
            {
                title: "Music Night",
                creator: creators[2]._id,
                category: categories[1]._id,
                isLive: false,
                viewerCount: 200,
            },
        ]);

        console.log("Seed completed!");
        process.exit(0);

    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
};

seed();
