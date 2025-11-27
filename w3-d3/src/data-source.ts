import { DataSource } from 'typeorm';
import { User } from './user/user.entity';

// ❗ Do NOT initialize DataSource in tests
export const AppDataSource =
  process.env.NODE_ENV === 'test'
    ? (null) // prevents accidental initialization
    : new DataSource({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      entities: [User],
      logging: false,
    });

export default AppDataSource;
