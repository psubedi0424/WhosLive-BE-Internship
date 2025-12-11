import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

describe('IngestController', () => {
  let controller: IngestController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      ingestAll: jest.fn().mockResolvedValue({ ok: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [{ provide: IngestService, useValue: mockService }],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /ingest/all should call service.ingestAll()', async () => {
    const result = await controller.ingestAll();

    expect(mockService.ingestAll).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('POST /ingest/all should call service.ingestAll()', async () => {
    const result = await controller.ingestAllPost();

    expect(mockService.ingestAll).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('GET /ingest/health should return health object', () => {
    const result = controller.health();
    expect(result).toEqual({ ok: true, module: 'ingest' });
  });
});
