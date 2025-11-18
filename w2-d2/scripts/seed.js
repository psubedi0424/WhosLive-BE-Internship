// scripts/seedData.js
import mongoose from 'mongoose';
import { Creator } from '../src/models/creator.model.js';
import { Category } from '../src/models/category.model.js';
import { Stream } from '../src/models/stream.model.js';
import { connectDB } from '../src/db.js';
import dotenv from 'dotenv';

dotenv.config();    

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Creator.deleteMany({});
        await Category.deleteMany({});
        await Stream.deleteMany({});

        // Create categories
        const categories = await Category.insertMany([
            { title: "Gaming", slug: "gaming" },
            { title: "Music", slug: "music" },
            { title: "Education", slug: "education" },
            { title: "Just Chatting", slug: "just-chatting" }
        ]);
        // Create creators
        const creators = await Creator.insertMany([
            {
                name: 'TechWithTim',
                username: 'techwithtim',
                platform: 'youtube',
                platformCreatorId: 'yt_tim123',
                email: 'tim@example.com',
                followers: 150000,
                isLive: true,
                avatar: 'https://example.com/tim.jpg'
            },
            {
                name: 'GamingQueen',
                username: 'gamingqueen',
                platform: 'twitch',
                platformCreatorId: 'tw_gq456',
                email: 'queen@example.com',
                followers: 89000,
                isLive: false,
                avatar: 'https://example.com/queen.jpg'
            },
            {
                name: 'CodeMaster',
                username: 'codemaster',
                platform: 'youtube',
                platformCreatorId: 'yt_cm789',
                email: 'coder@example.com',
                followers: 210000,
                isLive: true,
                avatar: 'https://example.com/coder.jpg'
            }
        ]);

        // Create streams
        await Stream.insertMany([
            {
                title: 'Learning Node.js Live',
                description: 'Building a streaming API with Express and MongoDB',
                platform: 'youtube',
                platformStreamId: 'yt_stream_1',
                creator: creators[0]._id,
                category: categories[2]._id, // Education
                isLive: true,
                viewerCount: 1500,
                startedAt: new Date()
            },
            {
                title: 'Valorant Tournament',
                description: 'Competitive Valorant gameplay',
                platform: 'twitch',
                platformStreamId: 'tw_stream_1',
                creator: creators[1]._id,
                category: categories[0]._id, // Gaming
                isLive: false,
                viewerCount: 890,
                startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                title: 'Advanced JavaScript Patterns',
                description: 'Deep dive into JS design patterns',
                platform: 'youtube',
                platformStreamId: 'yt_stream_2',
                creator: creators[2]._id,
                category: categories[2]._id, // Education
                isLive: true,
                viewerCount: 3200,
                startedAt: new Date()
            }
        ]);

        console.log('Data seeded successfully!');
        console.log(`Created: ${creators.length} creators, ${categories.length} categories, 3 streams`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();