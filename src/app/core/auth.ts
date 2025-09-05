import { inject, Injectable, untracked } from '@angular/core';
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
    this.ws.send('USER_LOGIN', { login, password });

    this.ws
      .onType('USER_LOGIN')
      .pipe(first())
      .subscribe((response) => {
        this.userStore.login({
          ...response.payload,
          password,
        });
        this.routerHandler.redirectToMain();
      });
  }

  public logout(): void {
    this.ws.send('USER_LOGOUT', { login: untracked(() => this.userStore.name()) });

    this.ws
      .onType('USER_LOGOUT')
      .pipe(first())
      .subscribe(() => {
        this.userStore.logout();
        this.routerHandler.redirectToLogin();
      });
  }
}
