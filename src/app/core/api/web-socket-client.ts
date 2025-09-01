import { Injectable, OnDestroy } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ChatApiRequest } from './types/request';
import { ChatApiResponse, ErrorResponse } from './types/response';
import { catchError, filter, Observable, of, retry, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketClient implements OnDestroy {
  private readonly socket$ = webSocket<ChatApiResponse | ChatApiRequest>('ws://localhost:4000');
  private socketSub: Subscription | null = null;
  public readonly connectionError$ = this.socket$.pipe(
    catchError(() =>
      of<ErrorResponse>({
        id: '',
        type: 'ERROR',
        payload: { error: 'Server Connection Error' },
      }),
    ),
  );

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socketSub = this.socket$
      .pipe(
        retry({
          delay: (_, retryCount) => timer(retryCount * 2000),
          count: 4,
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
      filter((message): message is Extract<ChatApiResponse, { type: T }> => message.type === type),
    );
  }

  public ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
    this.socket$.complete();
  }
}
