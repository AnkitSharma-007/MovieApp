import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import {
  register,
  registerFailure,
  registerSuccess,
} from '../actions/auth.actions';

@Injectable()
export class RegisterEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackbarService);

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      switchMap((action) =>
        this.userService.registerUser(action.userdetails).pipe(
          map(() => registerSuccess()),
          tap(() => {
            // Navigate to login after successful registration
            this.router.navigate(['/login']);
          }),
          catchError((error) => {
            // Log the error and show a snackbar notification
            console.error('Error occurred during user registration:', error);
            this.snackBarService.showSnackBar(
              'An error occurred. Please try again.'
            );
            return of(
              registerFailure({
                errorMessage: error.message || 'Unknown error',
              })
            );
          })
        )
      )
    )
  );
}
