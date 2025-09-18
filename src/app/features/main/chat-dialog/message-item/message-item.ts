import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Message } from '../../../../shared/models/message';
import { TuiIcon } from '@taiga-ui/core';
import { TuiMessage } from '@taiga-ui/kit';
import { DatePipe } from '@angular/common';
import { TuiCell } from '@taiga-ui/layout';

@Component({
  selector: 'app-message-item',
  imports: [TuiIcon, TuiMessage, DatePipe, TuiCell],
  templateUrl: './message-item.html',
  styleUrl: './message-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageItem {
  public readonly message = input.required<Message>();
  public readonly isOwn = input.required<boolean>();
  public readonly editing = input<boolean>(false);

  public readonly edit = output<{ id: string; text: string }>();
  public readonly delete = output<string>();

  public get appearance(): 'accent' | 'neutral' {
    return this.isOwn() ? 'accent' : 'neutral';
  }

  public get statusIcon(): string {
    return this.message().isDelivered ? '@tui.check-check' : '@tui.check';
  }

  public onEdit(): void {
    this.edit.emit({ id: this.message().id, text: this.message().text });
  }

  public onDelete(): void {
    this.delete.emit(this.message().id);
  }
}
