import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Message } from '../../../../shared/models/message';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'app-message-list',
  imports: [MessageItem],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageList {
  public readonly messages = input.required<Message[]>();
  public readonly receiverLogin = input.required<string>();
  public editingMessageId = input.required<string | null>();

  public edit = output<{ id: string; text: string }>();
  public delete = output<string>();

  public isOwn(message: Message): boolean {
    return message.from === this.receiverLogin();
  }
}
