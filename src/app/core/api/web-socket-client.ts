import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ChatApiRequest } from './types/request';
import { ChatApiResponse } from './types/response';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketClient {
  private readonly socket = webSocket<ChatApiResponse | ChatApiRequest>('ws://localhost:4000');

  public send(data: ChatApiRequest): void {
    this.socket.next(data);
  }

  private onMessage(): Observable<ChatApiResponse | ChatApiRequest> {
    return this.socket.asObservable();
  }

  public onType<T extends ChatApiResponse['type']>(
    type: T,
  ): Observable<Extract<ChatApiResponse, { type: T }>> {
    return this.onMessage().pipe(
      filter((message): message is Extract<ChatApiResponse, { type: T }> => message.type === type),
    );
  }
}
