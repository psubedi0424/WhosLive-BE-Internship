import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from '../entities/video.entity';
import { Creator } from '../entities/creator.entity';
import { Category } from '../entities/category.entity';
import { VideoService } from './videos.service';
import { VideoController } from './videos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Video, Creator, Category])],
    providers: [VideoService],
    controllers: [VideoController],
})
export class VideosModule { }