import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthValidation],
})
export class Auth {
  private readonly validation = new AuthValidation();

  protected readonly nameErrors = {
    required: 'Name is required',
    minlength: `Name must be at least ${String(this.validation.NAME_MIN_LENGTH)} characters`,
    maxlength: `Name must be at most  ${String(this.validation.NAME_MAX_LENGTH)} characters`,
    pattern: 'Only letters and digits are allowed',
  };

  protected readonly passwordErrors = {
    required: 'Password is required',
    minlength: `Password must be at least ${String(this.validation.PASSWORD_MIN_LENGTH)} characters`,
    missingNumber: 'Add a number',
    missingUpper: 'Add an uppercase letter',
    missingLower: 'Add a lowercase letter',
    missingSpecial: 'Add a special symbol',
  };

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
}
