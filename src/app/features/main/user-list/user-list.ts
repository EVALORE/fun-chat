import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiCell, TuiSearch } from '@taiga-ui/layout';
import { UserStore } from '../../../core/user-store';
import { TuiStatus } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, TuiCell, TuiStatus, TuiSearch, TuiTextfield, ReactiveFormsModule, TuiButton],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly ws = inject(WebSocketClient);
  private readonly user = inject(UserStore);

  public readonly search = signal<string>('');

  public readonly users = combineLatest([
    this.ws.onType('USER_ACTIVE'),
    this.ws.onType('USER_INACTIVE'),
  ]).pipe(
    map(([active, inactive]) =>
      [...active.payload.users, ...inactive.payload.users].filter(
        (user) => user.login !== this.user.login(),
      ),
    ),
  );

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
