import { DataSource } from 'typeorm';
import { Video } from './src/entities/video.entity';
import { Creator } from './src/entities/creator.entity';
import { Category } from './src/entities/category.entity';

 const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data/database.sqlite',
  entities: [Video, Creator, Category],
  synchronize: true,
  logging: true,
  migrations: ['src/migrations/*.ts'],
});
export default AppDataSource;