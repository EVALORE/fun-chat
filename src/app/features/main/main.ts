import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserList } from './user-list/user-list';
import { ChatDialog } from './chat-dialog/chat-dialog';
import { TuiIcon } from '@taiga-ui/core';
import { ReceiverStore } from '../../core/stores/receiver-store';

@Component({
  selector: 'app-main',
  imports: [UserList, ChatDialog, TuiIcon],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
  private readonly receiver = inject(ReceiverStore);
  public readonly receiverLogin = this.receiver.login;
}
