import { TuiRoot } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Auth } from './features/auth/auth';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, Auth],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
