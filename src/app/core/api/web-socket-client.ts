import { Injectable, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ChatApiRequest } from './types/request';
import { ChatApiResponse, ErrorResponse } from './types/response';
import { catchError, filter, fromEvent, Observable, of, retry, Subscription, switchMap, take, timer, } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketClient implements OnDestroy {
  private readonly socket$ = webSocket<ChatApiResponse | ChatApiRequest>('ws://localhost:4000');
  private socketSub: Subscription | null = null;

  constructor() {
    this.connect();
  }

  private nextDelayMs(retryCount: number): number {
    const base = Math.min(1000 * 2 ** retryCount, 30_000);
    const index = base * 0.2;
    return base - index + Math.random() * index * 2;
  }

  private waitUntilOnline(ms: number): Observable<number> {
    if (navigator.onLine) {
      return timer(ms);
    }
    return fromEvent(globalThis, 'online').pipe(
      take(1),
      switchMap(() => timer(ms)),
    );
  }

  private connect(): void {
    this.socketSub = this.socket$
      .pipe(
        retry({
          delay: (_, retryCount) => this.waitUntilOnline(this.nextDelayMs(retryCount)),
        }),
      )
      .subscribe();
  }

  public send<T extends ChatApiRequest['type']>(
    type: T,
    payload: Extract<ChatApiRequest, { type: T }>['payload'],
  ): void {
    this.socket$.next({
      id: crypto.randomUUID(),
      type,
      payload,
    } as ChatApiRequest);
  }

  public onType<T extends ChatApiResponse['type']>(
    type: T,
  ): Observable<Extract<ChatApiResponse, { type: T }>> {
    return this.socket$.pipe(
      catchError(() =>
        of<ErrorResponse>({
          id: '',
          type: 'ERROR',
          payload: { error: 'Server Connection Error' },
        }),
      ),
      filter((message): message is Extract<ChatApiResponse, { type: T }> => message.type === type),
    );
  }

  public ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
    this.socket$.complete();
  }
}
