import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  interval,
  map,
  Observable,
  switchMap,
  catchError,
  of,
  finalize,
} from 'rxjs';
import { StreamsService } from '../streams/streams.service';

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private failureCount = 0;
  private readonly FAILURE_LIMIT = 5; // trip circuit
  private circuitOpen = false;
  private readonly RESET_TIMEOUT = 15000; // 15s
  private resetTimer: NodeJS.Timeout | null = null;

  private activeConnections = new Set<Observable<any>>();

  constructor(private streams: StreamsService) {}

  onModuleDestroy() {
    // Clean up when module is destroyed
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    console.log(
      `Cleaning up ${this.activeConnections.size} active SSE connections`,
    );
    this.activeConnections.clear();
  }
  private async tryResetCircuit() {
    if (!this.circuitOpen) return;
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      this.circuitOpen = false;
      this.failureCount = 0;
      console.log('Circuit breaker reset to CLOSED state');
    }, this.RESET_TIMEOUT);
  }
  // Get metrics for monitoring (optional but useful)
  getConnectionStats() {
    return {
      activeConnections: this.activeConnections.size,
      failureCount: this.failureCount,
      circuitOpen: this.circuitOpen,
    };
  }
  streamEvents(): Observable<any> {
    const stream$ = interval(5000).pipe(
      switchMap(async () => {
        if (this.circuitOpen) {
          await this.tryResetCircuit();
          return {
            error: 'circuit_open',
            message: 'Provider unstable',
            circuitTripped: true,
          };
        }

        try {
          const data = await this.streams.findAll();
          this.failureCount = 0; // reset failure counter
          return { live: true, at: new Date(), data };
        } catch (err) {
          this.failureCount++;

          if (this.failureCount >= this.FAILURE_LIMIT) {
            this.circuitOpen = true;
          }

          return { error: true, message: err.message };
        }
      }),
      map((data) => ({ data })),
      catchError((err) => of({ data: { error: true, message: err.message } })),
    );
    // Track this connection
    this.activeConnections.add(stream$);
    //cleanup when connection ends
    return stream$.pipe(
      finalize(() => {
        this.activeConnections.delete(stream$);
        console.log(
          `SSE connection closed. Active: ${this.activeConnections.size}`,
        );
      }),
    );
  }
  getCircuitStatus() {
    return {
      failureCount: this.failureCount,
      circuitOpen: this.circuitOpen,
      failureLimit: this.FAILURE_LIMIT,
    };
  }
}
