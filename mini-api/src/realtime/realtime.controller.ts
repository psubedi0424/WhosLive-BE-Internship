import { Controller, Sse, MessageEvent, UseGuards, Get } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { interval, map, mergeMap, Observable } from 'rxjs';
import { ProviderService } from './provider.service';

@Controller('realtime')
@UseGuards(ThrottlerGuard)
export class RealtimeController {
  private metrics = {
    totalConnections: 0,
    messagesSent: 0,
    failures: 0,
    circuitTrips: 0,
    activeConnections: 0,
    lastUpdated: new Date().toISOString(),
  };
  constructor(
    private readonly realtimeService: RealtimeService,
    private readonly provider: ProviderService,
  ) {}

  // Rate limit: max 5 requests per minute per IP
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get('Live')
  @Sse()
  streamLive() {
    return interval(5000).pipe(
      mergeMap(async () => {
        const data = await this.provider.getLiveData();
        return { data };
      }),
    );
  }
  // streamLive(): Observable<MessageEvent> {
  //   return this.realtimeService.streamEvents();
  // }
  @Sse('health')
  health() {
    return new Observable<MessageEvent>((subscriber) => {
      subscriber.next({ data: { ok: true } });
      subscriber.complete();
    });
  }
  @Sse('metrics')
  getMetrics(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({
        data: {
          ...this.metrics,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
  // Optional: Add a regular HTTP endpoint for metrics
  @Get('metrics/json')
  getMetricsJson() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
    };
  }

  // Optional: Method to update metrics from service
  updateMetrics(updates: Partial<typeof this.metrics>) {
    this.metrics = { ...this.metrics, ...updates };
  }
}
