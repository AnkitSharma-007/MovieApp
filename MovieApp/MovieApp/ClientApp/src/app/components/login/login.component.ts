import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { map, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { LoginForm } from 'src/app/models/loginForm';
import { UserLogin } from 'src/app/models/userLogin';

import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Store } from '@ngrx/store';
import { login } from 'src/app/state/actions/auth.actions';
import { selectLoginError } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    RouterLink,
    MatCardSubtitle,
    MatError,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatCardActions,
  ],
})
export class LoginComponent implements OnDestroy {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected loginForm: FormGroup<LoginForm> = this.formBuilder.group({
    username: this.formBuilder.control('', Validators.required),
    password: this.formBuilder.control('', Validators.required),
  });
  private destroyed$ = new ReplaySubject<void>(1);
  showPassword = false;

  protected get loginFormControl() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.store.dispatch(
        login({
          loginCredentials: this.loginForm.value as UserLogin,
        })
      );
    }

    this.store
      .select(selectLoginError)
      .pipe(
        takeUntil(this.destroyed$),
        map((error) => {
          if (error) {
            this.loginForm.setErrors({ loginError: error });
            this.loginForm.reset();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
