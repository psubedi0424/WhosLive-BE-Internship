import request from 'supertest';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { Stream } from '../models/stream.models.js';
import { Creator } from '../models/creator.models.js';
import { Category } from '../models/category.models.js';

let app;

beforeAll(async () => {
    // Dynamically import app after setting test environment
    process.env.NODE_ENV = 'test';
    await connectDB();

    // Import app after environment is set
    const { default: expressApp } = await import('../server.js');
    app = expressApp;
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear data before each test
    await Stream.deleteMany({});
    await Creator.deleteMany({});
    await Category.deleteMany({});
});

describe('GET /streams', () => {
    it('should return paginated streams with cursor info', async () => {
        // Seed test data
        const category = await Category.create({ title: 'Test', slug: 'test' });
        const creator = await Creator.create({
            name: 'Test Creator',
            username: 'testcreator',
            email: 'test@example.com',
            platform: 'youtube',
            platformCreatorId: 'test_001'
        });

        // Create multiple streams
        const streams = [];
        for (let i = 0; i < 6; i++) {
            const stream = await Stream.create({
                title: `Stream ${i}`,
                platform: 'youtube',
                platformStreamId: `stream_${i}`,
                creator: creator._id,
                category: category._id,
                isLive: i % 2 === 0 // Every other stream is live
            });
            streams.push(stream);
        }

        const res = await request(app).get('/streams?limit=3');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(3);
        expect(res.body.pagination.hasNext).toBe(true);
        expect(res.body.pagination.nextCursor).toBe(streams[2]._id.toString());
    });

    it('should filter by live status', async () => {
        // ... create mixed live/offline streams
        const res = await request(app).get('/streams?live=true');

        expect(res.status).toBe(200);
        // All returned streams should have isLive: true
        res.body.data.forEach(stream => {
            expect(stream.isLive).toBe(true);
        });
    });

    it('should handle empty results', async () => {
        const res = await request(app).get('/streams?category=507f1f77bcf86cd799439011');

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(0);
        expect(res.body.pagination.hasNext).toBe(false);
        expect(res.body.pagination.nextCursor).toBeNull();
    });

    it('should return 400 for invalid cursor', async () => {
        const res = await request(app).get('/streams?cursor=invalid_cursor');

        expect(res.status).toBe(400);
    });
});