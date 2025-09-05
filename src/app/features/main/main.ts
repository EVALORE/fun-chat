import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UserList } from './user-list/user-list';
import { ChatDialog } from './chat-dialog/chat-dialog';
import { User } from '../../core/user';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-main',
  imports: [UserList, ChatDialog, TuiIcon],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
  public readonly receiver = signal<User | null>(null);
}
