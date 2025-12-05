import { Controller, Get, Query } from '@nestjs/common';
import { StreamsService } from './streams.service';

@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get()
  async getStreams(@Query('q') q?: string) {
    return this.streamsService.findAll(q);
  }
}
