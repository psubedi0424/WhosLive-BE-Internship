import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreatorsService } from './creators.service';

describe('CreatorsService', () => {
  let service: CreatorsService;
  let mockStreamModel: any;
  let mockCache: any;

  beforeEach(async () => {
    mockStreamModel = {
      find: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    mockCache = {
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatorsService,
        {
          provide: getModelToken('streams'),
          useValue: mockStreamModel,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCache,
        },
      ],
    }).compile();

    service = module.get<CreatorsService>(CreatorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findStreamsByCreator', () => {
    it('should return streams for a creator', async () => {
      const creatorId = 'creator-123';
      const mockStreams = [
        { streamId: '1', creatorId: 'creator-123', title: 'Stream 1' },
        { streamId: '2', creatorId: 'creator-123', title: 'Stream 2' },
      ];
      mockStreamModel.exec.mockResolvedValue(mockStreams);

      const result = await service.findStreamsByCreator(creatorId);

      expect(mockStreamModel.find).toHaveBeenCalledWith({ creatorId });
      expect(mockStreamModel.lean).toHaveBeenCalled();
      expect(mockStreamModel.exec).toHaveBeenCalled();
      expect(result).toEqual(mockStreams);
    });

    it('should return empty array when creator has no streams', async () => {
      mockStreamModel.exec.mockResolvedValue([]);

      const result = await service.findStreamsByCreator('creator-999');

      expect(result).toEqual([]);
    });
  });

  describe('invalidateCreator', () => {
    it('should delete creator cache', async () => {
      const creatorId = 'creator-456';

      await service.invalidateCreator(creatorId);

      expect(mockCache.del).toHaveBeenCalledWith(
        `creator:${creatorId}:streams`,
      );
    });
  });
});
