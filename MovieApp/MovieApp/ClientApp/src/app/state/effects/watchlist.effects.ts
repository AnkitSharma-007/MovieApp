import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { setAuthState } from '../actions/auth.actions';
import {
  clearWatchlist,
  clearWatchlistFailure,
  clearWatchlistSuccess,
  getWatchlist,
  getWatchlistFailure,
  getWatchlistSuccess,
  toggleWatchlist,
  toggleWatchlistFailure,
  toggleWatchlistSuccess,
} from '../actions/watchlist.actions';
import { selectAuthenticatedUser } from '../selectors/auth.selectors';

@Injectable()
export class WatchlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly watchlistService = inject(WatchlistService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly store = inject(Store);

  getWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWatchlist, setAuthState),
      concatLatestFrom(() => this.store.select(selectAuthenticatedUser)),
      switchMap(([, authenticatedUser]) => {
        if (authenticatedUser) {
          return this.watchlistService
            .getWatchlistItems(authenticatedUser.userId)
            .pipe(
              map((movies) => getWatchlistSuccess({ movies })),
              catchError((error) =>
                of(getWatchlistFailure({ errorMessage: error }))
              )
            );
        }
        return of(getWatchlistFailure({ errorMessage: 'User not found' }));
      })
    )
  );

  toggleWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleWatchlist),
      concatLatestFrom(() => this.store.select(selectAuthenticatedUser)),
      switchMap(([action, authenticatedUser]) => {
        if (authenticatedUser) {
          return this.watchlistService
            .toggleWatchlistItem(authenticatedUser.userId, action.movieId)
            .pipe(
              map((movies) => toggleWatchlistSuccess({ movies })),
              tap(() => {
                if (action.isAdd) {
                  this.snackBarService.showSnackBar('Added to Watchlist!!!');
                } else {
                  this.snackBarService.showSnackBar(
                    'Removed from Watchlist!!!'
                  );
                }
              }),
              catchError((error) =>
                of(toggleWatchlistFailure({ errorMessage: error }))
              )
            );
        }
        return of(toggleWatchlistFailure({ errorMessage: 'User not found' }));
      })
    )
  );

  clearWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearWatchlist),
      concatLatestFrom(() => this.store.select(selectAuthenticatedUser)),
      switchMap(([, authenticatedUser]) => {
        if (authenticatedUser) {
          return this.watchlistService
            .clearWatchlist(authenticatedUser.userId)
            .pipe(
              map(() => clearWatchlistSuccess()),
              tap(() =>
                this.snackBarService.showSnackBar('Watchlist cleared!!!')
              ),
              catchError((error) => {
                console.error(
                  'Error ocurred while removing items from the Watchlist : ',
                  error
                );
                return of(clearWatchlistFailure({ errorMessage: error }));
              })
            );
        }
        return of(clearWatchlistFailure({ errorMessage: 'User not found' }));
      })
    )
  );
}
