import { inject, Injectable } from '@angular/core';
import { WebSocketClient } from './api/web-socket-client';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly ws = inject(WebSocketClient);

  public login({ login, password }: { login: string; password: string }): void {
    this.ws.send({
      id: String(new Date()),
      type: 'USER_LOGIN',
      payload: { user: { login, password } },
    });
  }

  public logout(): void {
    this.ws.send({
      id: String(new Date()),
      type: 'USER_LOGOUT',
      payload: { user: { login: '', password: '' } },
    });
  }
}
