import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserNameValidationService {
  private readonly userService = inject(UserService);

  usernameAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value.trim() === '') {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        take(1),
        switchMap((value) => {
          if (!value || value.trim() === '') {
            return of(null);
          }
          return this.userService.validateUserName(value).pipe(
            map((isUserNameAvailable) =>
              isUserNameAvailable ? null : { userNameNotAvailable: true }
            ),
            catchError(() => of(null))
          );
        })
      );
    };
  }
}
