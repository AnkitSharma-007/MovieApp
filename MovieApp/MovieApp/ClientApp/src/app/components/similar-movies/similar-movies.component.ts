import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-similar-movies',
  templateUrl: './similar-movies.component.html',
  styleUrls: ['./similar-movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimilarMoviesComponent {
  // Added the following variable for better readability
  private readonly queryParams$ = this.activatedRoute.paramMap;

  similarMovies$ = this.queryParams$.pipe(
    switchMap((params) => {
      const movieId = Number(params.get('movieId'));
      return this.movieService.getsimilarMovies(movieId);
    })
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService
  ) {}
}
