import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TrimPipe } from './common/pipes/trim.pipe';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [TrimPipe],
})
export class AppModule {}
