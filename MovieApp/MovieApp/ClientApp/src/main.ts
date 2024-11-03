import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes/app.routes';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { environment } from './environments/environment';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([ApiInterceptor, ErrorInterceptor])),
    provideAnimations(),
    provideRouter(APP_ROUTES),
  ],
}).catch((err) => console.error(err));
