import { TuiButton, TuiRoot, TuiTextfield } from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, TuiButton, TuiTextfield],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
