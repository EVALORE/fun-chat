import { inject, Injectable } from '@angular/core';
import { WebSocketClient } from './api/web-socket-client';
import { TuiAlertService } from '@taiga-ui/core';
import { filter, Observable, switchMap } from 'rxjs';
import { UserStore } from './stores/user-store';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  private readonly ws = inject(WebSocketClient);
  private readonly alert = inject(TuiAlertService);
  private readonly user = inject(UserStore);

  constructor() {
    this.ws
      .onType('ERROR')
      .pipe(switchMap((response) => this.showError(response.payload.error)))
      .subscribe();

    this.ws
      .onType('USER_EXTERNAL_LOGIN')
      .pipe(
        filter(() => this.user.isOnline()),
        switchMap((response) => this.showInfo(`${response.payload.login} is online`)),
      )
      .subscribe();

    this.ws
      .onType('USER_EXTERNAL_LOGOUT')
      .pipe(
        filter(() => this.user.isOnline()),
        switchMap((response) => this.showInfo(`${response.payload.login} goes offline`)),
      )
      .subscribe();
  }

  private showError(error: string): Observable<void> {
    return this.alert.open(error, {
      label: 'Error',
      appearance: 'error',
    });
  }

  private showInfo(info: string): Observable<void> {
    return this.alert.open(info);
  }
}
