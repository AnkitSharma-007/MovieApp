import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsComponent {
  userData$ = this.subscriptionService.userData$.asObservable();

  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.paramMap;
  private readonly movie$ = this.movieService.movies$.asObservable();

  movieDetails$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      const selectedMovieId = Number(params.get('movieId'));
      return movies.find((movie) => movie.movieId === selectedMovieId);
    })
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService,
    private readonly subscriptionService: SubscriptionService
  ) {}
}
