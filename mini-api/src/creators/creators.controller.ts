import { Controller, Get, Param } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Controller('creators')
export class CreatorsController {
  constructor(
    private creatorsService: CreatorsService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}
  @Get(':id/streams')
  async getCreatorStreams(@Param('id') id: string) {
    const cacheKey = `creator:${id}:streams`;

    const cached = await this.cache.get(cacheKey);
    if (cached) return { cached: true, data: cached };

    const data = await this.creatorsService.findStreamsByCreator(id);

    await this.cache.set(cacheKey, data, 10_000);

    return { cached: false, data };
  }
  @Get('health')
  health() {
    return { ok: true, module: 'creators' };
  }
}
