import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserList } from './user-list/user-list';

@Component({
  selector: 'app-main',
  imports: [UserList],
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {}
