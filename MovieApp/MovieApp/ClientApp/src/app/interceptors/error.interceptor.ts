import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status == 401) {
          this.authenticationService.logout();
          if (!request.url.includes('login')) {
            location.reload();
          }
        } else if (error.status === 404) {
          this.router.navigate(['not-found']);
        }
        const errorMessage = error.error?.message || error.statusText;
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
