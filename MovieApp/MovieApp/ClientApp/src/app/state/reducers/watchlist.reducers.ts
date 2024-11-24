import { Movie } from 'src/app/models/movie';
import { CallState, LoadingState } from 'src/app/shared/call-state';
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
import { createReducer, on } from '@ngrx/store';
import { logout } from '../actions/auth.actions';

export const WATCHLIST_FEATURE_KEY = 'watchlist';

export interface WatchlistState {
  watchlistItems: Movie[];
  watchlistCallState: CallState;
}

const initialWatchlistState: WatchlistState = {
  watchlistItems: [],
  watchlistCallState: LoadingState.INIT,
};

export const watchlistReducer = createReducer(
  initialWatchlistState,
  on(getWatchlist, (state) => ({
    ...state,
    watchlistCallState: LoadingState.LOADING,
  })),
  on(getWatchlistSuccess, (state, { movies }) => ({
    ...state,
    watchlistItems: movies,
    watchlistCallState: LoadingState.LOADED,
  })),
  on(getWatchlistFailure, (state, { errorMessage }) => ({
    ...state,
    watchlistCallState: { errorMessage },
  })),
  on(toggleWatchlist, (state) => ({
    ...state,
    watchlistCallState: LoadingState.LOADING,
  })),
  on(toggleWatchlistSuccess, (state, { movies }) => ({
    ...state,
    watchlistItems: movies,
    watchlistCallState: LoadingState.LOADED,
  })),
  on(toggleWatchlistFailure, (state, { errorMessage }) => ({
    ...state,
    watchlistCallState: { errorMessage },
  })),
  on(clearWatchlist, (state) => ({
    ...state,
    watchlistCallState: LoadingState.LOADING,
  })),
  on(clearWatchlistSuccess, (state) => ({
    ...state,
    watchlistItems: [],
    watchlistCallState: LoadingState.LOADED,
  })),
  on(clearWatchlistFailure, (state, { errorMessage }) => ({
    ...state,
    watchlistCallState: { errorMessage },
  })),
  on(logout, () => initialWatchlistState)
);
