"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const video_entity_1 = require("./src/entities/video.entity");
const creator_entity_1 = require("./src/entities/creator.entity");
const category_entity_1 = require("./src/entities/category.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'data/database.sqlite',
    entities: [video_entity_1.Video, creator_entity_1.Creator, category_entity_1.Category],
    synchronize: true,
    logging: true,
    migrations: ['src/migrations/*.ts'],
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source.js.map