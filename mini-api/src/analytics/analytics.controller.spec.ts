import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let mockAnalyticsService: any;

  beforeEach(async () => {
    mockAnalyticsService = {
      snapshot: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /analytics/now', () => {
    it('should return analytics snapshot', async () => {
      const mockData = {
        cached: false,
        data: { total: 100, topGames: [] },
      };
      mockAnalyticsService.snapshot.mockResolvedValue(mockData);

      const result = await controller.now();

      expect(mockAnalyticsService.snapshot).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('GET /analytics/health', () => {
    it('should return health status', () => {
      const result = controller.health();

      expect(result).toEqual({ ok: true, module: 'analytics' });
    });
  });
});
