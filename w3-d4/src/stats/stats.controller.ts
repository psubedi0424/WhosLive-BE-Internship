// src/stats/stats.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('stats')
@UseInterceptors(CacheInterceptor)
export class StatsController {
  @Get()
  getStats() {
    return {
      users: 100,
      messages: 500,
      timestamp: new Date(),
    };
  }
}
