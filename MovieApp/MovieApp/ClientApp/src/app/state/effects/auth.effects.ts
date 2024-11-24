import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  setAuthState,
} from '../actions/auth.actions';
import { User } from 'src/app/models/user';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((action) =>
        this.authenticationService.login(action.loginCredentials).pipe(
          map((response) => {
            localStorage.setItem('authToken', response?.token);
            return loginSuccess();
          }),
          tap(() => {
            this.router.navigate(['/']);
          }),
          catchError((error: unknown) => {
            return of(loginFailure({ errorMessage: error as string }));
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  handleLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const userDetails = new User();
          const decodeUserDetails = JSON.parse(
            window.atob(authToken.split('.')[1])
          );
          userDetails.userId = decodeUserDetails.userId;
          userDetails.username = decodeUserDetails.name;
          userDetails.userTypeName = decodeUserDetails.sub;

          return setAuthState({
            user: userDetails,
          });
        } else {
          return loginFailure({ errorMessage: 'Invalid token' });
        }
      })
    )
  );
}
