import { Test, TestingModule } from '@nestjs/testing';
import { StreamsService } from './streams.service';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from '../analytics/analytics.service';

describe('StreamsService', () => {
  let service: StreamsService;
  let mockStreamModel: any;
  let mockRedis: any;
  let mockAnalyticsService: any;

  beforeEach(async () => {
    mockStreamModel = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    mockRedis = {
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn().mockResolvedValue(['streams:q=test', 'streams:q=gaming']),
    };

    mockAnalyticsService = {
      invalidate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsService,
        {
          provide: getModelToken('Stream'),
          useValue: mockStreamModel,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    service = module.get<StreamsService>(StreamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should fetch streams from DB when cache empty', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockStreamModel.exec.mockResolvedValue([{ id: 1 }]);

      const result = await service.findAll();

      expect(mockRedis.get).toHaveBeenCalledWith('streams:all');
      expect(mockStreamModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual([{ id: 1 }]);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'streams:all',
        10,
        JSON.stringify([{ id: 1 }]),
      );
    });

    it('should return cached data when available', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify([{ id: 2 }]));

      const result = await service.findAll();

      expect(mockRedis.get).toHaveBeenCalledWith('streams:all');
      expect(result).toEqual([{ id: 2 }]);
      expect(mockStreamModel.exec).not.toHaveBeenCalled();
    });

    it('should handle search query', async () => {
      const query = 'gaming';
      mockRedis.get.mockResolvedValue(null);
      mockStreamModel.exec.mockResolvedValue([
        { id: 3, title: 'Gaming Stream' },
      ]);

      const result = await service.findAll(query);

      expect(mockRedis.get).toHaveBeenCalledWith('streams:q=gaming');
      expect(mockStreamModel.find).toHaveBeenCalledWith({
        title: { $regex: query, $options: 'i' },
      });
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'streams:q=gaming',
        10,
        JSON.stringify([{ id: 3, title: 'Gaming Stream' }]),
      );
      expect(result).toEqual([{ id: 3, title: 'Gaming Stream' }]);
    });

    it('should return cached search results', async () => {
      const query = 'gaming';
      const cachedResults = [{ id: 4, title: 'Cached Gaming' }];
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedResults));

      const result = await service.findAll(query);

      expect(mockRedis.get).toHaveBeenCalledWith('streams:q=gaming');
      expect(result).toEqual(cachedResults);
      expect(mockStreamModel.find).not.toHaveBeenCalled();
    });
  });

  describe('upsertStream', () => {
    it('should upsert and invalidate all caches including creator cache', async () => {
      const streamData = { streamId: 'x1', creatorId: 'c1', title: 'Test' };
      const updatedStream = { ...streamData, _id: 'mongo-id' };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(updatedStream);

      const result = await service.upsertStream(streamData);

      expect(mockStreamModel.findOneAndUpdate).toHaveBeenCalledWith(
        { streamId: 'x1' },
        { $set: streamData },
        { upsert: true, new: true },
      );
      expect(mockRedis.del).toHaveBeenCalledWith('streams:all');
      expect(mockRedis.del).toHaveBeenCalledWith(
        'streams:q=test',
        'streams:q=gaming',
      );
      expect(mockRedis.del).toHaveBeenCalledWith('creator:c1:streams');
      expect(mockAnalyticsService.invalidate).toHaveBeenCalled();
      expect(result).toEqual(updatedStream);
    });

    it('should not invalidate creator cache when creatorId is missing', async () => {
      const streamData = { streamId: 'x2', title: 'No Creator' };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(streamData);
      mockRedis.keys.mockResolvedValue([]);

      await service.upsertStream(streamData);

      expect(mockRedis.del).toHaveBeenCalledWith('streams:all');
      expect(mockRedis.del).toHaveBeenCalledTimes(1); // Only streams:all
      expect(mockAnalyticsService.invalidate).toHaveBeenCalled();
      expect(mockRedis.del).not.toHaveBeenCalledWith(
        expect.stringContaining('creator:'),
      );
    });

    it('should handle falsy creatorId values', async () => {
      const streamData = { streamId: 'x3', creatorId: null };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(streamData);
      mockRedis.keys.mockResolvedValue([]);

      await service.upsertStream(streamData);

      expect(mockRedis.del).toHaveBeenCalledTimes(1);
      expect(mockRedis.del).toHaveBeenCalledWith('streams:all');
      expect(mockRedis.del).not.toHaveBeenCalledWith(
        expect.stringContaining('creator:'),
      );
    });
    it('should handle empty search keys array', async () => {
      const streamData = { streamId: 'x4', creatorId: 'c1', title: 'Test' };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(streamData);
      mockRedis.keys.mockResolvedValue([]);

      await service.upsertStream(streamData);

      // del should be called for streams:all and creator cache, but not for empty search keys
      expect(mockRedis.del).toHaveBeenCalledTimes(2);
      expect(mockRedis.del).toHaveBeenCalledWith('streams:all');
      expect(mockRedis.del).toHaveBeenCalledWith('creator:c1:streams');
    });
  });
});
