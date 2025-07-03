import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UserList } from './user-list/user-list';
import { UserDialog } from './user-dialog/user-dialog';
import { User } from '../../core/user';

@Component({
  selector: 'app-main',
  imports: [UserList, UserDialog],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {
  public readonly receiver = signal<User | null>(null);
}
