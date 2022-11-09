import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.paramMap;
  private readonly movie$ = this.movieService.movies$;

  movieDetails$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      const selectedMovieId = Number(params.get('movieID'));
      return movies.find((movie) => movie.movieId === selectedMovieId);
    })
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService
  ) {}
}
