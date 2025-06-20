import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiCell, TuiSearch } from '@taiga-ui/layout';
import { UserStore } from '../../../core/user-store';
import { TuiStatus } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  imports: [
    AsyncPipe,
    TuiCell,
    TuiStatus,
    TuiSearch,
    TuiTextfield,
    ReactiveFormsModule,
    TuiButton,
    FormsModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList implements OnInit {
  private readonly ws = inject(WebSocketClient);
  private readonly user = inject(UserStore);

  public readonly search = signal<string>('');

  public readonly users = combineLatest([
    this.ws.onType('USER_ACTIVE'),
    this.ws.onType('USER_INACTIVE'),
    toObservable(this.search),
  ]).pipe(
    map(([active, inactive, search]) =>
      [...active.payload.users, ...inactive.payload.users].filter(
        (user) => user.login !== this.user.login() && user.login.includes(search),
      ),
    ),
  );

  public searchChange(value: string): void {
    this.search.set(value);
  }

  public ngOnInit(): void {
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
  }
}
