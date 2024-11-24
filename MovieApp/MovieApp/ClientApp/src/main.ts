import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { AppComponent } from './app/app.component';
import { ApiInterceptor } from './app/interceptors/api.interceptor';
import { ErrorInterceptor } from './app/interceptors/error.interceptor';
import { APP_ROUTES } from './app/routes/app.routes';
import { GenreEffects } from './app/state/effects/genre.effects';
import { MovieEffects } from './app/state/effects/movie.effects';
import {
  GENRE_FEATURE_KEY,
  genreReducer,
} from './app/state/reducers/genre.reducer';
import {
  MOVIE_FEATURE_KEY,
  movieReducer,
} from './app/state/reducers/movie.reducer';
import { ROUTER_FEATURE_KEY } from './app/state/selectors/router.selectors';
import { environment } from './environments/environment';
import { AuthEffects } from './app/state/effects/auth.effects';
import {
  AUTH_FEATURE_KEY,
  authReducer,
} from './app/state/reducers/auth.reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  WATCHLIST_FEATURE_KEY,
  watchlistReducer,
} from './app/state/reducers/watchlist.reducers';
import { WatchlistEffects } from './app/state/effects/watchlist.effects';

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
    provideEffects(GenreEffects, MovieEffects, AuthEffects, WatchlistEffects),
    provideState({ name: GENRE_FEATURE_KEY, reducer: genreReducer }),
    provideState({ name: MOVIE_FEATURE_KEY, reducer: movieReducer }),
    provideState({ name: AUTH_FEATURE_KEY, reducer: authReducer }),
    provideState({ name: WATCHLIST_FEATURE_KEY, reducer: watchlistReducer }),
    provideRouterStore(),
    provideStore({ [ROUTER_FEATURE_KEY]: routerReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
}).catch((err) => console.error(err));
