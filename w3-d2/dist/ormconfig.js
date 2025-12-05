"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const creator_entity_1 = require("./src/entities/creator.entity");
const category_entity_1 = require("./src/entities/category.entity");
const video_entity_1 = require("./src/entities/video.entity");
exports.default = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [creator_entity_1.Creator, category_entity_1.Category, video_entity_1.Video],
    migrations: ['src/migrations/*.ts'],
});
//# sourceMappingURL=ormconfig.js.map