import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ChatApiRequest } from './types/request';
import { ChatApiResponse, ErrorResponse } from './types/response';
import { catchError, filter, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketClient {
  private readonly socket = webSocket<ChatApiResponse | ChatApiRequest>('ws://localhost:4000');

  public send(data: ChatApiRequest): void {
    this.socket.next(data);
  }

  public onConnectionError(): Observable<ErrorResponse> {
    return this.socket.pipe(
      catchError(() =>
        of<ErrorResponse>({
          id: '',
          type: 'ERROR',
          payload: { error: 'Server Connection Error' },
        }),
      ),
      filter(
        (response): response is ErrorResponse =>
          response.type === 'ERROR' && response.payload.error === 'Server Connection Error',
      ),
    );
  }

  public onType<T extends ChatApiResponse['type']>(
    type: T,
  ): Observable<Extract<ChatApiResponse, { type: T }>> {
    return this.socket.pipe(
      filter((message): message is Extract<ChatApiResponse, { type: T }> => message.type === type),
    );
  }
}
