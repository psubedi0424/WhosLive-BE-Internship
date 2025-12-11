import { Controller, Get, Query, Post, Body, Inject } from '@nestjs/common';
import { StreamsService } from './streams.service';
// import { Redis } from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
@Controller('streams')
export class StreamsController {
  constructor(
    private readonly streamsService: StreamsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  // @Get()
  // async getStreams(@Query('q') q?: string) {
  //   const cacheKey = q ? `streams:q=${q}` : 'streams:all';
  //   const cached = await this.redis.get(cacheKey);
  //   if (cached) return { cached: true, data: JSON.parse(cached) };

  //   const data = await this.streamsService.findAll(q);

  //   await this.redis.set(cacheKey, JSON.stringify(data));
  //   return { cached: false, data };
  // }
  // @Get()
  // async getStreams(@Query('q') q?: string) {
  //   return this.streamsService.findAll(q);
  // }
  @Get()
  async getStreams(@Query('q') q?: string) {
    const data = await this.streamsService.findAll(q);
    return { data };
  }
  @Post()
  async createStream(@Body() body: any) {
    return this.streamsService.upsertStream(body);
  }
}
