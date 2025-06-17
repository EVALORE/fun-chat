import { TuiButton, TuiIcon, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiTitle, TuiButton, TuiAvatar, TuiHeader, TuiIcon, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
