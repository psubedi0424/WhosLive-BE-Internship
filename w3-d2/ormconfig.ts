import { DataSource } from 'typeorm';
import { Creator } from './src/entities/creator.entity';
import { Category } from './src/entities/category.entity';
import { Video } from './src/entities/video.entity';

export default new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Creator, Category, Video],
    migrations: ['src/migrations/*.ts'],
});
