import { DataSource } from 'typeorm';
import { Video } from './src/entities/video.entity';
import { Creator } from './src/entities/creator.entity';
import { Category } from './src/entities/category.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data/database.sqlite',
  entities: [Video, Creator, Category],
  synchronize: true,
  logging: true,
});
