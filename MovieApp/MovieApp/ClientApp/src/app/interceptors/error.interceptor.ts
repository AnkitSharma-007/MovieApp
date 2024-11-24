import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { logout } from '../state/actions/auth.actions';

export const ErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const store = inject(Store);

  return next(request).pipe(
    catchError((error) => {
      if (error.status == 401) {
        store.dispatch(logout());
        if (!request.url.includes('login')) {
          location.reload();
        }
      } else if (error.status === 404) {
        router.navigate(['not-found']);
      }
      const errorMessage = error.error?.message || error.statusText;
      return throwError(() => new Error(errorMessage));
    })
  );
};
