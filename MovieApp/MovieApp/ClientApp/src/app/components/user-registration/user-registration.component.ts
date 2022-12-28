import { Component, OnDestroy } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { UserRegistration } from 'src/app/models/userRegistration';
import { UserRegistrationForm } from 'src/app/models/userRegistrationForm';
import { CustomFormValidatorService } from 'src/app/services/custom-form-validator.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserNameValidationService } from 'src/app/services/user-name-validation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnDestroy {
  protected userRegistrationForm!: FormGroup<UserRegistrationForm>;
  private destroyed$ = new ReplaySubject<void>(1);
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly userNameValidationService: UserNameValidationService,
    private readonly customFormValidator: CustomFormValidatorService,
    private readonly snackBarService: SnackbarService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userRegistrationForm = this.formBuilder.group(
      {
        firstName: this.formBuilder.control('', Validators.required),
        lastName: this.formBuilder.control('', Validators.required),
        userName: this.formBuilder.control('', {
          asyncValidators: [
            this.userNameValidationService.validate.bind(
              this.userNameValidationService
            ),
          ],
          validators: [Validators.required],
          updateOn: 'blur',
        }),
        password: this.formBuilder.control('', [
          Validators.required,
          this.customFormValidator.passwordPatternValidator(),
        ]),
        confirmPassword: this.formBuilder.control('', Validators.required),
        gender: this.formBuilder.control('', Validators.required),
      },
      {
        validators: [
          this.customFormValidator.matchPasswordValidator(
            'password',
            'confirmPassword'
          ),
        ],
      }
    );
  }

  registerUser(): void {
    if (this.userRegistrationForm.valid) {
      this.userService
        .registerUser(this.userRegistrationForm.value as UserRegistration)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error) => {
            this.snackBarService.showSnackBar('Error occurred!! Try again');
            console.error(
              'error occurred while trying to register a new user : ',
              error
            );
          },
        });
    }
  }

  protected get registrationFormControl() {
    return this.userRegistrationForm.controls;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
