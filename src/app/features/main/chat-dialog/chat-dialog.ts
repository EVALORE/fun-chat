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
  providers: [MessageHandler],
  templateUrl: './chat-dialog.html',
  styleUrl: './chat-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDialog {
  private readonly ws = inject(WebSocketClient);
  private readonly messageStore = inject(MessageHandler);
  public readonly receiver = input.required<User>();
  public userInput = '';
  public originalMessageText = '';
  public editingMessageId: string | null = null;

  public messages = this.messageStore.messages;

  constructor() {
    effect(() => {
      this.ws.send('MSG_FROM_USER', { login: this.receiver().login });
    });

    effect(() => {
      this.messageStore.setReceiver(this.receiver());
    });
  }

  public send(): void {
    if (this.userInput.length === 0) {
      return;
    }

    if (this.editingMessageId) {
      this.ws.send('MSG_EDIT', { id: this.editingMessageId, text: this.userInput });
      this.cancelEdit();
    } else {
      this.ws.send('MSG_SEND', { to: this.receiver().login, text: this.userInput });
    }

    this.userInput = '';
  }

  public deleteMessage(id: string): void {
    this.ws.send('MSG_DELETE', { id });
  }

  public startEdit(messageId: string, currentText: string): void {
    this.editingMessageId = messageId;
    this.originalMessageText = currentText;
    this.userInput = currentText;
  }

  public cancelEdit(): void {
    this.editingMessageId = null;
    this.originalMessageText = '';
    this.userInput = '';
  }

  public isEditingMode(): boolean {
    return this.editingMessageId !== null;
  }

  public isMyMessage(message: { from: string }): boolean {
    return message.from !== this.receiver().login;
  }

  public getStatusIcon(message: { isDelivered: boolean }): string {
    return message.isDelivered ? '@tui.check-check' : '@tui.check';
  }

  public getMessageAppearance(message: { from: string }): string {
    return message.from === this.receiver().login ? 'neutral' : 'accent';
  }
}
