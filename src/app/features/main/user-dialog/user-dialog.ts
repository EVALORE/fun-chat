import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { User } from '../../../core/user';
import { TuiBadge, TuiMessage, TuiStatus } from '@taiga-ui/kit';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiCell } from '@taiga-ui/layout';
import { MessageHandler } from './message-handler';

@Component({
  selector: 'app-user-dialog',
  imports: [
    TuiBadge,
    TuiStatus,
    TuiTextfield,
    TuiIcon,
    TuiMessage,
    AsyncPipe,
    FormsModule,
    DatePipe,
    TuiCell,
  ],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialog {
  private readonly ws = inject(WebSocketClient);
  private readonly messageStore = new MessageHandler();
  public readonly receiver = input.required<User>();
  public userInput = '';

  public messages = this.messageStore.messages;

  constructor() {
    effect(() => {
      this.ws.send('MSG_FROM_USER', { user: { login: this.receiver().login } });
    });

    effect(() => {
      this.messageStore.setReceiver(this.receiver());
    });
  }

  public send(): void {
    if (this.userInput.length === 0) {
      return;
    }
    this.ws.send('MSG_SEND', { message: { to: this.receiver().login, text: this.userInput } });
    this.userInput = '';
  }

  public getStatusIcon(message: { status: { isDelivered: boolean } }): string {
    return message.status.isDelivered ? '@tui.check-check' : '@tui.check';
  }

  public getMessageAppearance(message: { from: string }): string {
    return message.from === this.receiver().login ? 'neutral' : 'accent';
  }
}
