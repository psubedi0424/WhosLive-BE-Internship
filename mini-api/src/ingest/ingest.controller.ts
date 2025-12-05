import { Controller, Get, Post } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Get('all')
  async ingestAll() {
    return this.ingestService.ingestAll();
  }
  @Get('health')
  health() {
    return { ok: true, module: 'ingest' };
  }
  @Post('all')
  async ingestAllPost() {
    return this.ingestService.ingestAll();
  }
}
