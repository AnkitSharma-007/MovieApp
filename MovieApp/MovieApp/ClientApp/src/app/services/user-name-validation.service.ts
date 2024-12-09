import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
} from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserNameValidationService implements AsyncValidator {
  private readonly userService = inject(UserService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.validateUserName(control.value).pipe(
      map((isUserNameAvailable) =>
        isUserNameAvailable ? null : { userNameNotAvailable: true }
      ),
      catchError(() => of(null))
    );
  }
}
