import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '../data-source';
import { VideosModule } from './videos/videos.module';
import { CreatorsModule } from './creators/creator.module';
import { CategoriesModule } from './categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    VideosModule,
    CreatorsModule,
    CategoriesModule,
  ],
})
export class AppModule { }