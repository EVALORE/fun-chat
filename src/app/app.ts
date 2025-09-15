import { TuiIcon, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { RouterOutlet } from '@angular/router';
import { UserMenu } from './features/user-menu/user-menu';
import { Notifications } from './core/notifications';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiTitle, TuiHeader, TuiIcon, RouterOutlet, UserMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly notifications = inject(Notifications);
}
