import { TuiButton, TuiIcon, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Login } from './features/auth/login';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, Login, TuiTitle, TuiButton, TuiAvatar, TuiHeader, TuiIcon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
