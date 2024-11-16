import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { APP_ROUTES } from './app/routes/app.routes';
import { GenreEffects } from './app/state/effects/genre.effects';
import {
  GENRE_FEATURE_KEY,
  genreReducer,
} from './app/state/reducers/genre.reducer';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([ApiInterceptor, ErrorInterceptor])),
    provideAnimations(),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideStore(),
    provideEffects(GenreEffects),
    provideState({ name: GENRE_FEATURE_KEY, reducer: genreReducer }),
  ],
}).catch((err) => console.error(err));
