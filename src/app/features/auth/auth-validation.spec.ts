import { TestBed } from '@angular/core/testing';

import { AuthValidation } from './auth-validation';

describe('AuthValidation', () => {
  let service: AuthValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
