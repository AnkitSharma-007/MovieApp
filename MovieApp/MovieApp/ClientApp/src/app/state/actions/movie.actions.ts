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

export const getMovies = createAction('[Movie API] Get Movie');

export const getMoviesSuccess = createAction(
  '[Movie API] Get Movies Success',
  props<{ movies: Movie[] }>()
);

export const getMoviesFailure = createAction(
  '[Movie API] Get Movies Failure',
  props<{ errorMessage: string }>()
);

export const addMovie = createAction(
  '[Movie API] Add Movie',
  props<{ movie: FormData }>()
);

export const addMovieSuccess = createAction('[Movie API] Add Movie Success');

export const addMovieFailure = createAction(
  '[Movie API] Add Movie Failure',
  props<{ errorMessage: string }>()
);

export const updateMovie = createAction(
  '[Movie API] Update Movie',
  props<{ movie: FormData }>()
);

export const updateMovieSuccess = createAction(
  '[Movie API] Update Movie Success'
);

export const updateMovieFailure = createAction(
  '[Movie API] Update Movie Failure',
  props<{ errorMessage: string }>()
);

export const deleteMovie = createAction(
  '[Movie API] Delete Movie',
  props<{ movieId: number }>()
);

export const deleteMovieSuccess = createAction(
  '[Movie API] Delete Movie Success'
);

export const deleteMovieFailure = createAction(
  '[Movie API] Delete Movie Failure',
  props<{ errorMessage: string }>()
);
