import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserRegistration } from 'src/app/models/userRegistration';
import { UserRegistrationForm } from 'src/app/models/userRegistrationForm';
import { CustomFormValidatorService } from 'src/app/services/custom-form-validator.service';
import { UserNameValidationService } from 'src/app/services/user-name-validation.service';
import { register } from 'src/app/state/actions/auth.actions';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    RouterLink,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatIcon,
    MatSuffix,
    MatRadioGroup,
    MatRadioButton,
    MatCardActions,
  ],
})
export class UserRegistrationComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly userNameValidationService = inject(
    UserNameValidationService
  );
  private readonly customFormValidator = inject(CustomFormValidatorService);
  private readonly store = inject(Store);

  showPassword = false;
  showConfirmPassword = false;

  protected userRegistrationForm: FormGroup<UserRegistrationForm> =
    this.formBuilder.group(
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

  registerUser(): void {
    if (this.userRegistrationForm.valid) {
      this.store.dispatch(
        register({
          userdetails: this.userRegistrationForm.value as UserRegistration,
        })
      );
    }
  }

  protected get registrationFormControl() {
    return this.userRegistrationForm.controls;
  }
}
