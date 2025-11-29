import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('stats')
export class StatsController {
  private computeHeavy() {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) total += i;
    return total;
  }

  // baseline (not cached)
  @Get('heavy')
  heavy() {
    return { total: this.computeHeavy(), ts: Date.now() };
  }

  // optimized: cached via CacheInterceptor (redis)
  @UseInterceptors(CacheInterceptor)
  @Get('heavy-cached')
  heavyCached() {
    return { total: this.computeHeavy(), ts: Date.now() };
  }
}
