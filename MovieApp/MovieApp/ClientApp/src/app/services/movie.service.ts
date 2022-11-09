import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { Genre } from '../models/genre';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  baseURL = 'api/movie/';

  constructor(private readonly http: HttpClient) {}

  genre$ = this.http
    .get<Genre[]>(this.baseURL + 'GetGenreList')
    .pipe(shareReplay(1));

  movies$ = this.getAllMovies().pipe(shareReplay(1));

  private getAllMovies() {
    return this.http.get<Movie[]>(this.baseURL);
  }
}
