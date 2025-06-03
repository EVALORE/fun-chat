import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class AuthValidation {
  public readonly NAME_MIN_LENGTH = 3;
  public readonly NAME_MAX_LENGTH = 20;
  public readonly NAME_PATTERN = /^[a-zA-Z0-9]+$/u;
  public readonly PASSWORD_MIN_LENGTH = 8;

  public readonly nameErrors = {
    required: 'Name is required',
    minlength: `Name must be at least ${String(this.NAME_MIN_LENGTH)} characters`,
    maxlength: `Name must be at most  ${String(this.NAME_MAX_LENGTH)} characters`,
    pattern: 'Only letters and digits are allowed',
  };

  public readonly passwordErrors = {
    required: 'Password is required',
    minlength: `Password must be at least ${String(this.PASSWORD_MIN_LENGTH)} characters`,
    missingNumber: 'Add a number',
    missingUpper: 'Add an uppercase letter',
    missingLower: 'Add a lowercase letter',
    missingSpecial: 'Add a special symbol',
  };

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
