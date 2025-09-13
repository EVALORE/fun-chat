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
import { MessagesHandler } from './messages-handler';
import { MessageList } from './message-list/message-list';

@Component({
  selector: 'app-user-dialog',
  imports: [TuiBadge, TuiStatus, TuiTextfield, TuiIcon, AsyncPipe, FormsModule, MessageList],
  providers: [MessagesHandler],
  templateUrl: './chat-dialog.html',
  styleUrl: './chat-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatDialog implements AfterViewInit {
  @ViewChild('conversationContainer') private conversationContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('unreadDivider') private unreadDivider: ElementRef<HTMLInputElement> | undefined;

  private readonly ws = inject(WebSocketClient);
  private readonly messagesHandler = inject(MessagesHandler);
  public readonly receiver = input.required<User>();
  public userInput = '';
  public originalMessageText = '';
  public editingMessageId: string | null = null;

  public readonly oldMessages = this.messagesHandler.oldMessages$;
  public readonly newMessages = this.messagesHandler.newMessages$;
  public readonly showDivider = this.messagesHandler.showDivider;
  public readonly isEmpty = this.messagesHandler.isEmpty$;

  constructor() {
    effect(() => {
      this.messagesHandler.setReceiver(this.receiver());
    });

    effect(() => {
      const subscription = this.oldMessages.subscribe((messageList) => {
        if (messageList.length > 0) {
          setTimeout(() => {
            this.adjustInitialScroll();
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

  private adjustInitialScroll(): void {
    const container = this.conversationContainer.nativeElement;

    const dividerElement = this.unreadDivider?.nativeElement;
    const canScroll = container.scrollHeight > container.clientHeight;

    if (dividerElement && canScroll) {
      const dividerOffsetTop = dividerElement.offsetTop;
      const target =
        dividerOffsetTop - container.clientHeight / 2 + dividerElement.clientHeight / 2;

      container.scrollTop = Math.max(0, Math.min(target, container.scrollHeight));
    } else {
      this.scrollToBottom();
    }
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
    this.adjustInitialScroll();
  }

  public onScroll(): void {
    const element = this.conversationContainer.nativeElement;

    const threshold = 8;
    const atBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;

    if (atBottom) {
      this.messagesHandler.mergeMessages();
    }
  }
}
