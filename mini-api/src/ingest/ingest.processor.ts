import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { StreamsService } from '../streams/streams.service';

@Processor('ingest')
export class IngestProcessor {
  constructor(private readonly streamsService: StreamsService) {}

  @Process({
    name: 'ingest',
    concurrency: 5,
  })
  async handle(job: Job) {
    const { streams, source } = job.data;
    const start = Date.now();

    for (const stream of streams) {
      await this.streamsService.upsertStream(stream);
    }

    const duration = Date.now() - start;

    console.log(`[INGEST] ${source} — ${streams.length} items — ${duration}ms`);

    return { duration };
  }
}
