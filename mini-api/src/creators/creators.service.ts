import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel('streams') private streamModel: Model<any>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findStreamsByCreator(id: string) {
    return this.streamModel.find({ creatorId: id }).lean().exec();
  }

  async invalidateCreator(id: string) {
    await this.cache.del(`creator:${id}:streams`);
  }
}
