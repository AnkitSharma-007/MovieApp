import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Genre } from '../models/genre';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = 'api/movie';

  getAllMovies() {
    return this.http.get<Movie[]>(this.baseURL);
  }

  getsimilarMovies(movieId: number) {
    return this.http.get<Movie[]>(
      `${this.baseURL}/GetSimilarMovies/${movieId}`
    );
  }

  getMovieById(movieId: number) {
    return this.getAllMovies().pipe(
      map((movies) => movies.find((movie) => movie.movieId === movieId))
    );
  }

  addMovie(movie: FormData) {
    return this.http.post(this.baseURL, movie);
  }

  updateMovieDetails(movie: FormData) {
    return this.http.put(this.baseURL, movie);
  }

  deleteMovie(movieId: number) {
    return this.http.delete(`${this.baseURL}/${movieId}`);
  }

  getGenres() {
    return this.http.get<Genre[]>(`${this.baseURL}/GetGenreList`);
  }
}
