import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async getHello(): Promise<string> {
    await this.cacheManager.set('cached_item', { key: 32 });
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log('Cached Item:', cachedItem);
    return 'Hello World!';
  }
}
