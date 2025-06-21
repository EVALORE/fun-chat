import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserList } from './user-list/user-list';
import { UserDialog } from './user-dialog/user-dialog';

@Component({
  selector: 'app-main',
  imports: [UserList, UserDialog],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {}
