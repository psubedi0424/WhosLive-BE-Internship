import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { VideoService } from './videos.service';
import { CreateVideoDto } from './video.dto';

@Controller('videos')
export class VideoController {
    constructor(private service: VideoService) { }

    @Get()
    list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.service.findAll(page, limit);
    }

    @Get('live')
    getLiveVideos() {
        return this.service.findLiveVideos();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateVideoDto) {
        return this.service.create(dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}