import { Test, TestingModule } from '@nestjs/testing';
import { StreamsService } from './streams.service';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from '../analytics/analytics.service';

describe('StreamsService', () => {
  let service: StreamsService;
  let mockStreamModel: any;
  let mockCache: any;
  let mockAnalyticsService: any;

  beforeEach(async () => {
    mockStreamModel = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
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
          provide: 'CACHE_MANAGER',
          useValue: mockCache,
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
      mockCache.get.mockResolvedValue(null);
      mockStreamModel.exec.mockResolvedValue([{ id: 1 }]);

      const result = await service.findAll();

      expect(mockCache.get).toHaveBeenCalledWith('streams:all');
      expect(mockStreamModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual([{ id: 1 }]);
      expect(mockCache.set).toHaveBeenCalledWith(
        'streams:all',
        [{ id: 1 }],
        10_000,
      );
    });

    it('should return cached data when available', async () => {
      mockCache.get.mockResolvedValue([{ id: 2 }]);

      const result = await service.findAll();

      expect(mockCache.get).toHaveBeenCalledWith('streams:all');
      expect(result).toEqual([{ id: 2 }]);
      expect(mockStreamModel.exec).not.toHaveBeenCalled();
    });

    it('should handle search query', async () => {
      const query = 'gaming';
      mockCache.get.mockResolvedValue(null);
      mockStreamModel.exec.mockResolvedValue([
        { id: 3, title: 'Gaming Stream' },
      ]);

      const result = await service.findAll(query);

      expect(mockCache.get).toHaveBeenCalledWith('streams:q=gaming');
      expect(mockStreamModel.find).toHaveBeenCalledWith({
        title: { $regex: query, $options: 'i' },
      });
      expect(mockCache.set).toHaveBeenCalledWith(
        'streams:q=gaming',
        [{ id: 3, title: 'Gaming Stream' }],
        10_000,
      );
      expect(result).toEqual([{ id: 3, title: 'Gaming Stream' }]);
    });

    it('should return cached search results', async () => {
      const query = 'gaming';
      const cachedResults = [{ id: 4, title: 'Cached Gaming' }];
      mockCache.get.mockResolvedValue(cachedResults);

      const result = await service.findAll(query);

      expect(mockCache.get).toHaveBeenCalledWith('streams:q=gaming');
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
      expect(mockCache.del).toHaveBeenCalledWith('streams:all');
      expect(mockCache.del).toHaveBeenCalledWith('creator:c1:streams');
      expect(mockAnalyticsService.invalidate).toHaveBeenCalled();
      expect(result).toEqual(updatedStream);
    });

    it('should not invalidate creator cache when creatorId is missing', async () => {
      const streamData = { streamId: 'x2', title: 'No Creator' };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(streamData);

      await service.upsertStream(streamData);

      expect(mockCache.del).toHaveBeenCalledWith('streams:all');
      expect(mockCache.del).toHaveBeenCalledTimes(1); // Only streams:all
      expect(mockAnalyticsService.invalidate).toHaveBeenCalled();
    });

    it('should handle falsy creatorId values', async () => {
      const streamData = { streamId: 'x3', creatorId: null };
      mockStreamModel.findOneAndUpdate.mockResolvedValue(streamData);

      await service.upsertStream(streamData);

      expect(mockCache.del).toHaveBeenCalledTimes(1);
      expect(mockCache.del).not.toHaveBeenCalledWith(
        expect.stringContaining('creator:'),
      );
    });
  });
});
