import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeController } from './realtime.controller';
import { RealtimeService } from './realtime.service';
import { ProviderService } from './provider.service';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('RealtimeController', () => {
  let controller: RealtimeController;
  let mockRealtime: any;
  let mockProvider: any;

  beforeEach(async () => {
    jest.useFakeTimers();

    mockRealtime = {
      streamEvents: jest.fn(),
    };

    mockProvider = {
      getLiveData: jest.fn(),
    };
    const mockGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealtimeController],
      providers: [
        { provide: RealtimeService, useValue: mockRealtime },
        { provide: ProviderService, useValue: mockProvider },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<RealtimeController>(RealtimeController);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  // ---------------------------------------------------------
  // /realtime/health (SSE)
  // ---------------------------------------------------------
  it('should return SSE health event', (done) => {
    const stream$ = controller.health();

    stream$.subscribe({
      next: (event) => {
        expect(event.data).toEqual({ ok: true });
      },
      complete: () => {
        done();
      },
    });
  });

  // ---------------------------------------------------------
  // /realtime/Live (SSE - provider.getLiveData)
  // ---------------------------------------------------------
  it('should return live SSE events from provider', (done) => {
    mockProvider.getLiveData.mockResolvedValue({ live: true });

    const stream$ = controller.streamLive();

    const sub = stream$.subscribe((event) => {
      expect(event.data).toEqual({ live: true });
      sub.unsubscribe();
      done();
    });

    jest.advanceTimersByTime(5000); // simulate interval tick
  });

  // ---------------------------------------------------------
  // /realtime/metrics (SSE)
  // ---------------------------------------------------------
  it('should emit SSE metrics data', (done) => {
    const stream$ = controller.getMetrics();

    const sub = stream$.subscribe((event) => {
      expect(event.data).toHaveProperty('totalConnections');
      expect(event.data).toHaveProperty('timestamp');
      sub.unsubscribe();
      done();
    });

    jest.advanceTimersByTime(1000);
  });

  // ---------------------------------------------------------
  // /realtime/metrics/json
  // ---------------------------------------------------------
  it('should return metrics JSON object', () => {
    const result = controller.getMetricsJson();

    expect(result).toHaveProperty('totalConnections');
    expect(result).toHaveProperty('timestamp');
  });

  // ---------------------------------------------------------
  // updateMetrics internal method
  // ---------------------------------------------------------
  it('should update metrics correctly', () => {
    controller.updateMetrics({ failures: 99 });

    const result = controller.getMetricsJson();
    expect(result.failures).toBe(99);
  });
});
