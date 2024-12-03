import { createAction, props } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';

export const getsimilarMovies = createAction('[Genre API] Get Similar Movies');

export const getsimilarMoviesSuccess = createAction(
  '[Genre] Get Similar Movies Success',
  props<{ movies: Movie[] }>()
);

export const getsimilarMoviesFailure = createAction(
  '[Genre] Get Similar Movies Failure',
  props<{ errorMessage: string }>()
);
