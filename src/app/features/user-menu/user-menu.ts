import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { UserStore } from '../../core/user-store';

@Component({
  selector: 'app-user-menu',
  imports: [TuiAvatar],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  public readonly user = inject(UserStore);
}
