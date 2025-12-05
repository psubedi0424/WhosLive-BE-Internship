"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const category_entity_1 = require("./entities/category.entity");
const creator_entity_1 = require("./entities/creator.entity");
const video_entity_1 = require("./entities/video.entity");
async function seed() {
    try {
        console.log("🌱 Initializing Data Source...");
        await data_source_1.default.initialize();
        const categoryRepo = data_source_1.default.getRepository(category_entity_1.Category);
        const creatorRepo = data_source_1.default.getRepository(creator_entity_1.Creator);
        const videoRepo = data_source_1.default.getRepository(video_entity_1.Video);
        console.log("🗑 Clearing old records...");
        await videoRepo.clear();
        await creatorRepo.clear();
        await categoryRepo.clear();
        console.log("📘 Inserting Categories...");
        const tech = categoryRepo.create({
            slug: "tech",
            name: "Tech",
            title: "Technology",
            description: "Tech videos",
        });
        const gaming = categoryRepo.create({
            slug: "gaming",
            name: "Gaming",
            title: "Gaming Zone",
            description: "Gaming entertainment",
        });
        await categoryRepo.save([tech, gaming]);
        console.log("👤 Inserting Creator...");
        const creator = creatorRepo.create({
            username: "john_doe",
            name: "John Doe",
            email: "john@example.com",
            platform: "YouTube",
            avatar: "https://avatar.com/john",
        });
        await creatorRepo.save(creator);
        console.log("🎬 Inserting Video...");
        const video = videoRepo.create({
            title: "Intro to TypeScript",
            description: "Learn basics of TypeScript",
            creator: creator,
            categories: [tech],
            isLive: true,
            viewerCount: 120,
        });
        await videoRepo.save(video);
        console.log("✅ Seed Completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
}
void seed();
//# sourceMappingURL=seed.js.map