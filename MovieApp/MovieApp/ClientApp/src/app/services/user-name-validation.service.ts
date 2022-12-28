import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
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
export class UserNameValidationService {
  constructor(private readonly userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.userService.validateUserName(control.value).pipe(
      // TODO: Debounce is not working properly.
      debounceTime(1000),
      distinctUntilChanged(),
      map((isUserNameAvailable) => {
        if (isUserNameAvailable) {
          return null;
        } else {
          return { userNameNotAvailable: true };
        }
      }),
      catchError(() => of(null))
    );
  }
}
