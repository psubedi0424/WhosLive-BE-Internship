import { Test, TestingModule } from '@nestjs/testing';
import { IngestService } from './ingest.service';
import { getQueueToken } from '@nestjs/bull';

// Mock the adapters
jest.mock('./adapters/twitch.adapters', () => {
  return {
    twitchAdapter: jest.fn().mockImplementation(() => ({
      fetchStreams: jest.fn().mockResolvedValue([{ id: 't1' }]),
    })),
  };
});

jest.mock('./adapters/youtube.adapters', () => {
  return {
    youtubeAdapter: jest.fn().mockImplementation(() => ({
      fetchStreams: jest.fn().mockResolvedValue([{ id: 'y1' }]),
    })),
  };
});

describe('IngestService', () => {
  let service: IngestService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: getQueueToken('ingest'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<IngestService>(IngestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ingestAll should fetch streams and push 2 jobs to queue', async () => {
    const response = await service.ingestAll();

    expect(response).toEqual({ ok: true });

    // Queue should be called twice
    expect(mockQueue.add).toHaveBeenCalledTimes(2);

    // Check first job
    expect(mockQueue.add).toHaveBeenNthCalledWith(
      1,
      'ingest',
      { streams: [{ id: 't1' }], source: 'twitch' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );

    // Check second job
    expect(mockQueue.add).toHaveBeenNthCalledWith(
      2,
      'ingest',
      { streams: [{ id: 'y1' }], source: 'youtube' },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  });
});
