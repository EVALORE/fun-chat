import { ChangeDetectionStrategy, Component, inject, signal, untracked } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCard, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';
import { AuthValidation } from './auth-validation';
import { Errors } from '../../shared/ui/errors';
import { Auth } from '../../core/auth';
import { map, merge, tap } from 'rxjs';
import { WebSocketClient } from '../../core/api/web-socket-client';

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
    TuiNotification,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthValidation],
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly validation = inject(AuthValidation);
  private readonly ws = inject(WebSocketClient);
  private readonly auth = inject(Auth);

  protected readonly nameErrors = this.validation.nameErrors;
  protected readonly passwordErrors = this.validation.passwordErrors;

  protected readonly isSubmitting = signal<boolean>(false);

  protected readonly loginResponse$ = merge(
    this.ws.connectionError$,
    this.ws.onType('USER_LOGIN'),
    this.ws.onType('ERROR'),
  ).pipe(
    map((response) =>
      response.type === 'ERROR'
        ? {
            appearance: 'error',
            message: response.payload.error,
          }
        : {
            appearance: 'positive',
            message: 'login successful proceeded',
          },
    ),
    tap((response) => {
      if (response.appearance === 'positive') {
        this.authForm.reset();
      }
      this.isSubmitting.set(false);
    }),
  );

  protected readonly authForm = this.fb.group({
    login: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.validation.NAME_MIN_LENGTH),
      Validators.maxLength(this.validation.NAME_MAX_LENGTH),
      Validators.pattern(this.validation.NAME_PATTERN),
    ]),
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(this.validation.PASSWORD_MIN_LENGTH),
      this.validation.passwordValidator(),
    ]),
  });

  public submit(): void {
    if (this.authForm.invalid || untracked(this.isSubmitting)) {
      return;
    }

    this.isSubmitting.set(true);
    this.auth.login(this.authForm.getRawValue());
  }
}
