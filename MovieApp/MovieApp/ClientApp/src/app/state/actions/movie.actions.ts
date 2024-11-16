import { createAction, props } from '@ngrx/store';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';

export const getGenres = createAction('[Genre API] Get Genre');

export const getGenreSuccess = createAction(
  '[Genre API] Get Genre Success',
  props<{ genres: Genre[] }>()
);
export const getGenreFailure = createAction(
  '[Genre API] Get Genre Failure',
  props<{ errorMessage: string }>()
);

export const getMoviesSuccess = createAction(
  '[Movie API] Get Movies Success',
  props<{ movies: Movie[] }>()
);
export const getMoviesFailure = createAction(
  '[Movie API] Get Movies Failure',
  props<{ errorMessage: string }>()
);
