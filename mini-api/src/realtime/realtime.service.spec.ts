import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeService } from './realtime.service';
import { StreamsService } from '../streams/streams.service';

describe('RealtimeService', () => {
  let service: RealtimeService;
  let mockStreams: any;

  beforeEach(async () => {
    jest.useFakeTimers();

    mockStreams = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealtimeService,
        { provide: StreamsService, useValue: mockStreams },
      ],
    }).compile();

    service = module.get<RealtimeService>(RealtimeService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ------------------------------------------
  // SUCCESS EMISSION
  // ------------------------------------------
  it('should emit live data on success', (done) => {
    mockStreams.findAll.mockResolvedValue([{ id: 1 }]);

    const stream$ = service.streamEvents(5);

    const sub = stream$.subscribe((res) => {
      expect(res.data.live).toBe(true);
      expect(Array.isArray(res.data.data)).toBe(true);
      sub.unsubscribe();
      done();
    });

    jest.advanceTimersByTime(5);
  });

  // ------------------------------------------
  // FAILURE INCREMENT
  // ------------------------------------------
  it('should increment failureCount on error', (done) => {
    mockStreams.findAll.mockRejectedValue(new Error('DB error'));

    const stream$ = service.streamEvents(5);

    const sub = stream$.subscribe((res) => {
      expect(res.data.error).toBe(true);
      expect(service.getCircuitStatus().failureCount).toBe(1);
      sub.unsubscribe();
      done();
    });

    jest.advanceTimersByTime(5);
  });

  // ------------------------------------------
  // CIRCUIT TRIP
  // ------------------------------------------
  it('should open circuit after limit reached', (done) => {
    mockStreams.findAll.mockRejectedValue(new Error('DB error'));

    const stream$ = service.streamEvents(1);
    let count = 0;

    const sub = stream$.subscribe(() => {
      count++;
      jest.advanceTimersByTime(1);

      if (count === 5) {
        const status = service.getCircuitStatus();
        expect(status.circuitOpen).toBe(true);
        expect(status.failureCount).toBe(5);
        sub.unsubscribe();
        done();
      }
    });

    jest.advanceTimersByTime(1);
  });

  // ------------------------------------------
  // CIRCUIT OPEN RESPONSE
  // ------------------------------------------
  it('should return circuit_open when tripped', (done) => {
    mockStreams.findAll.mockRejectedValue(new Error('x'));

    const s1$ = service.streamEvents(1);

    let n = 0;
    const sub1 = s1$.subscribe(() => {
      n++;
      jest.advanceTimersByTime(1);

      if (n === 5) {
        sub1.unsubscribe();

        // second stream sees OPEN immediately
        const s2$ = service.streamEvents(1);

        const sub2 = s2$.subscribe((res) => {
          expect(res.data.error).toBe('circuit_open');
          expect(res.data.circuitTripped).toBe(true);
          sub2.unsubscribe();
          done();
        });

        jest.advanceTimersByTime(1);
      }
    });

    jest.advanceTimersByTime(1);
  });

  // ------------------------------------------
  // FAILURE COUNTER RESET
  // ------------------------------------------
  it('should reset failure counter after success', (done) => {
    mockStreams.findAll
      .mockRejectedValueOnce(new Error('DB error'))
      .mockResolvedValueOnce([{ id: 1 }]);

    const stream$ = service.streamEvents(1);
    let n = 0;

    const sub = stream$.subscribe(() => {
      n++;
      jest.advanceTimersByTime(1);

      if (n === 1) {
        expect(service.getCircuitStatus().failureCount).toBe(1);
      }

      if (n === 2) {
        expect(service.getCircuitStatus().failureCount).toBe(0);
        sub.unsubscribe();
        done();
      }
    });

    jest.advanceTimersByTime(1);
  });

  // ------------------------------------------
  // ACTIVE CONNECTIONS
  // ------------------------------------------
  it('should track active connections', () => {
    mockStreams.findAll.mockResolvedValue([]);

    expect(service.getConnectionStats().activeConnections).toBe(0);

    const s$ = service.streamEvents(1);
    expect(service.getConnectionStats().activeConnections).toBe(1);

    const sub = s$.subscribe();
    sub.unsubscribe();

    expect(service.getConnectionStats().activeConnections).toBe(0);
  });

  // ------------------------------------------
  // MODULE DESTROY
  // ------------------------------------------
  it('should clear connections on destroy', () => {
    mockStreams.findAll.mockResolvedValue([]);

    const s1$ = service.streamEvents(1);
    const sub1 = s1$.subscribe();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const s2$ = service.streamEvents(1);
    const sub2 = s2$.subscribe();

    expect(service.getConnectionStats().activeConnections).toBe(2);

    service.onModuleDestroy();

    expect(service.getConnectionStats().activeConnections).toBe(0);
    sub1.unsubscribe();
    sub2.unsubscribe();
  });
});
