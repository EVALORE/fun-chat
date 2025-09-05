import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { UserStore } from '../../core/user-store';
import { TuiButton } from '@taiga-ui/core';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-user-menu',
  imports: [TuiAvatar, TuiButton],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenu {
  public readonly user = inject(UserStore);
  public readonly auth = inject(Auth);

  public logout(): void {
    this.auth.logout();
  }
}
