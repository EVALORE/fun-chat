import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAppearance, TuiButton, TuiError, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCard, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';
import { AuthValidation } from './auth-validation';
import { Errors } from '../../shared/ui/errors';

@Component({
  selector: 'app-auth',
  imports: [
    TuiTextfield,
    ReactiveFormsModule,
    TuiForm,
    TuiAppearance,
    TuiCard,
    TuiHeader,
    TuiTitle,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    Errors,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthValidation],
})
export class Login {
  private readonly validation = inject(AuthValidation);

  protected readonly nameErrors = this.validation.nameErrors;
  protected readonly passwordErrors = this.validation.passwordErrors;

  protected readonly authForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(this.validation.NAME_MIN_LENGTH),
      Validators.maxLength(this.validation.NAME_MAX_LENGTH),
      Validators.pattern(this.validation.NAME_PATTERN),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.validation.PASSWORD_MIN_LENGTH),
      this.validation.passwordValidator(),
    ]),
  });

  public submit(): void {
    if (this.authForm.invalid) {
      return;
    }

    this.authForm.reset();
  }
}
