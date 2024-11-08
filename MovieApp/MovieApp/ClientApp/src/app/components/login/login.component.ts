import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { LoginForm } from 'src/app/models/loginForm';
import { UserLogin } from 'src/app/models/userLogin';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';

import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';

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
    MatCardActions
],
})
export class LoginComponent implements OnDestroy {
  protected loginForm!: FormGroup<LoginForm>;
  private destroyed$ = new ReplaySubject<void>(1);
  showPassword = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
    });
  }

  protected get loginFormControl() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.authenticationService
        .login(
          // TODO: Can we remove as??
          this.loginForm.value as UserLogin
        )
        .pipe(
          switchMap(() => {
            return this.activatedRoute.queryParams;
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe({
          next: (params) => {
            const returnUrl = params['returnUrl'] || '/';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            this.loginForm.reset();
            this.loginForm.setErrors({
              invalidLogin: true,
            });
            console.error('Error ocurred while login : ', error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
