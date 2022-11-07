import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  genreName = '';

  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.queryParams;
  private readonly movie$ = this.movieService.movies$;

  movieList$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      this.genreName = params['genre'];

      if (this.genreName) {
        const filteredMovie = movies.filter(
          (movie) => movie.genre.toLocaleLowerCase() === this.genreName
        );
        return filteredMovie;
      } else {
        return movies;
      }
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService
  ) {}
}
