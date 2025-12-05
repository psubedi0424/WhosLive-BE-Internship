import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { CreatorsController } from './creators.controller';
import { CreatorsService } from './creators.service';
import { StreamSchema } from '../streams/streams.schema'; // Your schema

@Module({
  imports: [
    // Import Mongoose schema
    MongooseModule.forFeature([{ name: 'streams', schema: StreamSchema }]),

    // Import CacheModule if needed (or it might be imported globally)
    CacheModule.register(),
  ],
  controllers: [CreatorsController],
  providers: [CreatorsService], // ✅ Make sure CreatorsService is provided here
  exports: [CreatorsService], // ✅ Export if needed by other modules
})
export class CreatorsModule {}
