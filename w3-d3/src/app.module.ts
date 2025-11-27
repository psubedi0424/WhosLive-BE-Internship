// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './user/user.module';
// import { AppDataSource } from './data-source';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useFactory: async () => {
//         // initialize datasource
//         if (!AppDataSource.isInitialized) await AppDataSource.initialize();
//         return {
//           type: 'sqlite',
//           database: 'db.sqlite',
//           synchronize: true,
//           entities: [__dirname + '/**/*.entity{.ts,.js}'],
//         };
//       },
//     }),
//     UsersModule,
//     AuthModule,
//   ],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    ...(process.env.NODE_ENV !== 'test'
      ? [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
      ]
      : []),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule { }