import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../../core/user';
import { TuiBadge, TuiStatus } from '@taiga-ui/kit';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-user-dialog',
  imports: [TuiBadge, TuiStatus, TuiTextfield, TuiIcon],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialog {
  public readonly receiver = input.required<User>();
}
