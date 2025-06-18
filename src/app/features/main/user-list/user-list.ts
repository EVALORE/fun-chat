import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly ws = inject(WebSocketClient);
  public readonly users = combineLatest([
    this.ws.onType('USER_ACTIVE'),
    this.ws.onType('USER_INACTIVE'),
  ]).pipe(map(([active, inactive]) => [...active.payload.users, ...inactive.payload.users]));

  constructor() {
    setTimeout(() => {
      this.ws.send({
        id: String(Date.now()),
        type: 'USER_ACTIVE',
        payload: null,
      });

      this.ws.send({
        id: String(Date.now()),
        type: 'USER_INACTIVE',
        payload: null,
      });
    }, 1000);
  }
}
