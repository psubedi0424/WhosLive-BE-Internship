import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import  AppDataSource  from '../data-source';
import { VideosModule } from './videos/videos.module';
import { CreatorsModule } from './creators/creator.module';
import { CategoriesModule } from './categories/category.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    VideosModule,
    CreatorsModule,
    CategoriesModule,
  ],
  controllers: [ AppController ],
  providers: [],  

})
export class AppModule { }