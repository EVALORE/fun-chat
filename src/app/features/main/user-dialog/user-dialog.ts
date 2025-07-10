import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { User } from '../../../core/user';
import { TuiBadge, TuiMessage, TuiStatus } from '@taiga-ui/kit';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { AsyncPipe } from '@angular/common';
import { map, merge, scan } from 'rxjs';

@Component({
  selector: 'app-user-dialog',
  imports: [TuiBadge, TuiStatus, TuiTextfield, TuiIcon, TuiMessage, AsyncPipe],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialog {
  private readonly ws = inject(WebSocketClient);
  public readonly receiver = input.required<User>();

  public messages = merge(this.ws.onType('MSG_FROM_USER'), this.ws.onType('MSG_SEND')).pipe(
    map((response) =>
      response.type === 'MSG_FROM_USER' ? response.payload.messages : [response.payload.message],
    ),
    scan((accumulator, currentMessages) =>
      currentMessages.length === 1 ? [...accumulator, ...currentMessages] : currentMessages,
    ),
  );

  constructor() {
    effect(() => {
      this.ws.send('MSG_FROM_USER', { user: { login: this.receiver().login } });
    });
  }

  public send(message: string): void {
    this.ws.send('MSG_SEND', { message: { to: this.receiver().login, text: message } });
  }
}
