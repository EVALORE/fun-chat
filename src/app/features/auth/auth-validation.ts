import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class AuthValidation {
  public readonly NAME_MIN_LENGTH = 3;
  public readonly NAME_MAX_LENGTH = 20;
  public readonly NAME_PATTERN = /^[a-zA-Z0-9]+$/u;
  public readonly PASSWORD_MIN_LENGTH = 8;

  private readonly passwordValidations = [
    { key: 'missingLower', pattern: /[a-z]/u },
    { key: 'missingUpper', pattern: /[A-Z]/u },
    { key: 'missingNumber', pattern: /[0-9]/u },
    { key: 'missingSpecial', pattern: /[!@#$%^&*()_+\-=;':"|,.<>/?]/u },
  ];

  public passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) {
        return null;
      }

      const errors: ValidationErrors = {};
      let errorsCount = 0;
      for (const { key, pattern } of this.passwordValidations) {
        if (!pattern.test(value)) {
          errors[key] = true;
          errorsCount += 1;
        }
      }

      return errorsCount > 0 ? errors : null;
    };
  }
}
