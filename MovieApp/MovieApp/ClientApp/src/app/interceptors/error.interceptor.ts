import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export const ErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error) => {
      if (error.status == 401) {
        authenticationService.logout();
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
