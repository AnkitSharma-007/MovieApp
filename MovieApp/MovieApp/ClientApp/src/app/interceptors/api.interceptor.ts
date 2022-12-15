import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const headerToken = localStorage.getItem('authToken');

    if (headerToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${headerToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
