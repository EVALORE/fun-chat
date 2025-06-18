import { TuiIcon, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiHeader } from '@taiga-ui/layout';
import { RouterOutlet } from '@angular/router';
import { UserMenu } from './features/user-menu/user-menu';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiTitle, TuiHeader, TuiIcon, RouterOutlet, UserMenu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
