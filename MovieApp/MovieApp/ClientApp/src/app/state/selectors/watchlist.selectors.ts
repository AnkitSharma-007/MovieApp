import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  WATCHLIST_FEATURE_KEY,
  WatchlistState,
} from '../reducers/watchlist.reducers';

const selectGenresFeatureState = createFeatureSelector<WatchlistState>(
  WATCHLIST_FEATURE_KEY
);

export const selectWatchlistItems = createSelector(
  selectGenresFeatureState,
  (state: WatchlistState) => state.watchlistItems
);

export const selectWatchlistItemsCount = createSelector(
  selectGenresFeatureState,
  (state: WatchlistState) => state?.watchlistItems.length
);
