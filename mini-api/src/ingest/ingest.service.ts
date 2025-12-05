import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { twitchAdapter } from './adapters/twitch.adapters';
import { youtubeAdapter } from './adapters/youtube.adapters';
import { Queue } from 'bull';

@Injectable()
export class IngestService {
  private twitch = new twitchAdapter();
  private youtube = new youtubeAdapter();

  constructor(
    @InjectQueue('ingest')
    private ingestQueue: Queue,
  ) {}

  async ingestAll() {
    const twitchStreams = await this.twitch.fetchStreams();
    const youtubeStreams = await this.youtube.fetchStreams();

    await this.ingestQueue.add(
      'ingest',
      { streams: twitchStreams, source: 'twitch' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    await this.ingestQueue.add(
      'ingest',
      { streams: youtubeStreams, source: 'youtube' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    return { ok: true };
  }
}
