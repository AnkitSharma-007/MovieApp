import { createAction, props } from '@ngrx/store';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';

export const getGenres = createAction('[Genre API] Get Genre');

export const getGenreSuccess = createAction(
  '[Genre] Get Genre Success',
  props<{ genres: Genre[] }>()
);

export const getGenreFailure = createAction(
  '[Genre] Get Genre Failure',
  props<{ errorMessage: string }>()
);

export const getMovies = createAction('[Movie API] Get Movie');

export const getMoviesSuccess = createAction(
  '[Movie] Get Movies Success',
  props<{ movies: Movie[] }>()
);

export const getMoviesFailure = createAction(
  '[Movie] Get Movies Failure',
  props<{ errorMessage: string }>()
);

export const addMovie = createAction(
  '[Movie] Add Movie',
  props<{ movie: FormData }>()
);

export const addMovieSuccess = createAction(
  '[Movie] Add Movie Success',
  props<{ movie: Movie }>()
);

export const addMovieFailure = createAction(
  '[Movie] Add Movie Failure',
  props<{ errorMessage: string }>()
);

export const updateMovie = createAction(
  '[Movie] Update Movie',
  props<{ movie: FormData }>()
);

export const updateMovieSuccess = createAction(
  '[Movie] Update Movie Success',
  props<{ movie: Movie }>()
);

export const updateMovieFailure = createAction(
  '[Movie] Update Movie Failure',
  props<{ errorMessage: string }>()
);

export const deleteMovie = createAction(
  '[Movie] Delete Movie',
  props<{ movieId: number }>()
);

export const deleteMovieSuccess = createAction(
  '[Movie] Delete Movie Success',
  props<{ movieId: number }>()
);

export const deleteMovieFailure = createAction(
  '[Movie] Delete Movie Failure',
  props<{ errorMessage: string }>()
);

export const cancelMovieFormNavigation = createAction(
  '[Movie] Cancel Movie Form Navigation'
);

export const setSearchItemValue = createAction(
  '[Movie] Set Search Item Value',
  props<{ searchItem: string }>()
);
