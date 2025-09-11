import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { User } from '../../../core/user';
import { TuiBadge, TuiStatus } from '@taiga-ui/kit';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { WebSocketClient } from '../../../core/api/web-socket-client';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageHandler } from './message-handler';
import { MessageList } from './message-list/message-list';

@Component({
  selector: 'app-user-dialog',
  imports: [TuiBadge, TuiStatus, TuiTextfield, TuiIcon, AsyncPipe, FormsModule, MessageList],
  providers: [MessageHandler],
  templateUrl: './chat-dialog.html',
  styleUrl: './chat-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDialog implements AfterViewInit {
  @ViewChild('conversationContainer') private conversationContainer!: ElementRef<HTMLDivElement>;

  private readonly ws = inject(WebSocketClient);
  private readonly messageStore = inject(MessageHandler);
  public readonly receiver = input.required<User>();
  public userInput = '';
  public originalMessageText = '';
  public editingMessageId: string | null = null;

  public readonly oldMessages = this.messageStore.oldMessages$;
  public readonly newMessages = this.messageStore.newMessages$;
  public readonly showDivider = this.messageStore.showDivider;
  public readonly isEmpty = this.messageStore.isEmpty$;

  constructor() {
    effect(() => {
      this.messageStore.setReceiver(this.receiver());
    });

    effect(() => {
      const subscription = this.oldMessages.subscribe((messageList) => {
        if (messageList.length > 0) {
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);
        }
      });

      return (): void => {
        subscription.unsubscribe();
      };
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

  private scrollToBottom(): void {
    const element = this.conversationContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
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

  public ngAfterViewInit(): void {
    this.scrollToBottom();
  }
}
