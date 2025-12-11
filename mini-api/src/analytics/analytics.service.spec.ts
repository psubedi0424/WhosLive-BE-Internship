import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { Stream } from '../streams/streams.schema';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockStreamModel: any;
  let mockCache: any;

  beforeEach(async () => {
    mockStreamModel = {
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
    };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken(Stream.name),
          useValue: mockStreamModel,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCache,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('snapshot', () => {
    it('should return cached data when available', async () => {
      const cachedData = { total: 50, topGames: [] };
      mockCache.get.mockResolvedValue(cachedData);

      const result = await service.snapshot();

      expect(mockCache.get).toHaveBeenCalledWith('analytics:now');
      expect(result).toEqual({ cached: true, data: cachedData });
      expect(mockStreamModel.countDocuments).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when cache empty', async () => {
      mockCache.get.mockResolvedValue(null);
      mockStreamModel.countDocuments.mockResolvedValue(100);
      mockStreamModel.aggregate.mockResolvedValue([
        { _id: 'Game1', count: 10 },
        { _id: 'Game2', count: 5 },
      ]);

      const result = await service.snapshot();

      expect(mockCache.get).toHaveBeenCalledWith('analytics:now');
      expect(mockStreamModel.countDocuments).toHaveBeenCalled();
      expect(mockStreamModel.aggregate).toHaveBeenCalledWith([
        { $group: { _id: '$game', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
      expect(mockCache.set).toHaveBeenCalledWith(
        'analytics:now',
        {
          total: 100,
          topGames: [
            { _id: 'Game1', count: 10 },
            { _id: 'Game2', count: 5 },
          ],
        },
        10_000,
      );
      expect(result).toEqual({
        cached: false,
        data: {
          total: 100,
          topGames: [
            { _id: 'Game1', count: 10 },
            { _id: 'Game2', count: 5 },
          ],
        },
      });
    });
  });

  describe('invalidate', () => {
    it('should delete analytics cache', async () => {
      await service.invalidate();

      expect(mockCache.del).toHaveBeenCalledWith('analytics:now');
    });
  });
});
