import { Test } from '@nestjs/testing';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';

describe('StreamsController', () => {
  let controller: StreamsController;
  let mockStreamsService: any;

  beforeEach(async () => {
    mockStreamsService = {
      findAll: jest.fn().mockResolvedValue([{ id: 1 }]),
      upsertStream: jest.fn().mockResolvedValue({ ok: true }),
    };

    const mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module = await Test.createTestingModule({
      controllers: [StreamsController],
      providers: [
        { provide: StreamsService, useValue: mockStreamsService },
        { provide: 'CACHE_MANAGER', useValue: mockCache },
      ],
    }).compile();

    controller = module.get(StreamsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /streams', () => {
    it('should return list of streams', async () => {
      const result = await controller.getStreams();

      expect(mockStreamsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ data: [{ id: 1 }] });
    });

    it('should return filtered streams when query provided', async () => {
      const query = 'gaming';
      mockStreamsService.findAll.mockResolvedValue([
        { id: 2, title: 'Gaming' },
      ]);

      const result = await controller.getStreams(query);

      expect(mockStreamsService.findAll).toHaveBeenCalledWith(query);
      expect(result.data).toEqual([{ id: 2, title: 'Gaming' }]);
    });

    it('should handle errors from service', async () => {
      mockStreamsService.findAll.mockRejectedValue(new Error('DB error'));

      await expect(controller.getStreams()).rejects.toThrow('DB error');
    });
  });

  describe('POST /streams', () => {
    it('should create stream', async () => {
      const streamData = { streamId: '123', title: 'Test' };

      const result = await controller.createStream(streamData);

      expect(mockStreamsService.upsertStream).toHaveBeenCalledWith(streamData);
      expect(result).toEqual({ ok: true });
    });
  });
});
