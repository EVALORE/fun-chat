import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { combineLatest, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiCell, TuiSearch } from '@taiga-ui/layout';
import { UserStore } from '../../../core/user-store';
import { TuiStatus } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '../../../core/user';

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
  public readonly selectedUser = output<User>();

  public readonly users = combineLatest([
    this.ws.onType('USER_LIST'),
    toObservable(this.search),
    this.ws.onType('USER_EXTERNAL_LOGIN').pipe(startWith(null)),
    this.ws.onType('USER_EXTERNAL_LOGOUT').pipe(startWith(null)),
  ]).pipe(
    map(([users, search, externalLogin, externalLogout]) => {
      const allUsers: User[] = [...users.payload.users];

      if (externalLogin) {
        allUsers.push(externalLogin.payload);
      }

      if (externalLogout) {
        allUsers.splice(
          allUsers.findIndex((user) => user.login === externalLogout.payload.login),
          1,
          externalLogout.payload,
        );
      }

      const uniqueUsers = [...new Map(allUsers.map((user) => [user.login, user])).values()];

      return uniqueUsers.filter(
        (user) => user.login !== this.user.name() && user.login.includes(search),
      );
    }),
  );

  public searchChange(value: string): void {
    this.search.set(value);
  }

  public selectUser(user: User): void {
    this.selectedUser.emit(user);
  }

  public ngOnInit(): void {
    this.ws.send('USER_LIST', {});
  }
}
