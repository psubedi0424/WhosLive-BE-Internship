import { Test, TestingModule } from '@nestjs/testing';
import { CreatorsController } from './creators.controller';
import { CreatorsService } from './creators.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CreatorsController', () => {
  let controller: CreatorsController;
  let mockCreatorsService: any;
  let mockCache: any;

  beforeEach(async () => {
    mockCreatorsService = {
      findStreamsByCreator: jest.fn(),
    };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorsController],
      providers: [
        { provide: CreatorsService, useValue: mockCreatorsService },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    controller = module.get<CreatorsController>(CreatorsController);
  });

  // ------------------------------------------------------
  // HEALTH ENDPOINT
  // ------------------------------------------------------
  it('should return health status', () => {
    expect(controller.health()).toEqual({ ok: true, module: 'creators' });
  });

  // ------------------------------------------------------
  // CACHE HIT
  // ------------------------------------------------------
  it('should return cached creator streams', async () => {
    mockCache.get.mockResolvedValue([{ id: 111 }]);

    const result = await controller.getCreatorStreams('123');

    expect(result).toEqual({
      cached: true,
      data: [{ id: 111 }],
    });

    expect(mockCache.get).toHaveBeenCalledWith('creator:123:streams');
    expect(mockCreatorsService.findStreamsByCreator).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------
  // CACHE MISS
  // ------------------------------------------------------
  it('should fetch creator streams and save to cache', async () => {
    mockCache.get.mockResolvedValue(null); // MISS
    mockCreatorsService.findStreamsByCreator.mockResolvedValue([{ id: 222 }]);

    const result = await controller.getCreatorStreams('999');

    expect(result).toEqual({
      cached: false,
      data: [{ id: 222 }],
    });

    expect(mockCache.get).toHaveBeenCalledWith('creator:999:streams');
    expect(mockCreatorsService.findStreamsByCreator).toHaveBeenCalledWith(
      '999',
    );

    expect(mockCache.set).toHaveBeenCalledWith(
      'creator:999:streams',
      [{ id: 222 }],
      10000,
    );
  });
});
