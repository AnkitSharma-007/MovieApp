import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GENRE_FEATURE_KEY, GenreState } from '../reducers/genre.reducer';

const selectGenresFeatureState =
  createFeatureSelector<GenreState>(GENRE_FEATURE_KEY);

export const selectGenres = createSelector(
  selectGenresFeatureState,
  (state: GenreState) => state.genres
);
