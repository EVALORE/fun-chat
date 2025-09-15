import { DestroyRef, inject, Injectable } from '@angular/core';
import { WebSocketClient } from './api/web-socket-client';
import { TuiAlertService } from '@taiga-ui/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Notifications {
  private readonly ws = inject(WebSocketClient);
  private readonly alert = inject(TuiAlertService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.ws
      .onType('ERROR')
      .pipe(switchMap((response) => this.ErrorNotification(response.payload.error)))
      .subscribe();

    this.ws
      .onType('USER_EXTERNAL_LOGIN')
      .pipe(switchMap((response) => this.alert.open(`${response.payload.login} is online`)))
      .subscribe();

    this.ws
      .onType('USER_EXTERNAL_LOGOUT')
      .pipe(switchMap((response) => this.alert.open(`${response.payload.login} goes offline`)))
      .subscribe();
  }

  private ErrorNotification(error: string): Observable<void> {
    return this.alert.open(error, {
      label: 'Error',
      appearance: 'error',
    });
  }
}
