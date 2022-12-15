import { TestBed } from '@angular/core/testing';

import { CustomFormValidatorService } from './custom-form-validator.service';

describe('CustomFormValidatorService', () => {
  let service: CustomFormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomFormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
