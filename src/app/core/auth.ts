import { inject, Injectable } from '@angular/core';
import { WebSocketClient } from './api/web-socket-client';
import { RouterHandler } from './routing/router-handler';
import { first } from 'rxjs';
import { UserStore } from './user-store';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly ws = inject(WebSocketClient);
  private readonly routerHandler = inject(RouterHandler);
  private readonly userStore = inject(UserStore);

  public login({ login, password }: { login: string; password: string }): void {
    this.ws.send({
      id: String(new Date()),
      type: 'USER_LOGIN',
      payload: { user: { login, password } },
    });

    this.ws
      .onType('USER_LOGIN')
      .pipe(first())
      .subscribe(() => {
        this.userStore.user.set(login);
        this.routerHandler.redirectToMain();
      });
  }

  public logout(): void {
    this.ws.send({
      id: String(new Date()),
      type: 'USER_LOGOUT',
      payload: { user: { login: '', password: '' } },
    });

    this.ws
      .onType('USER_LOGOUT')
      .pipe(first())
      .subscribe(() => {
        this.userStore.user.set('');
        this.routerHandler.redirectToLogin();
      });
  }
}
