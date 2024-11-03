import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { ConvertMinToHourPipe } from '../../pipes/convert-min-to-hour.pipe';
import { MatButton } from '@angular/material/button';
import { SimilarMoviesComponent } from '../similar-movies/similar-movies.component';
import { MovieSummaryComponent } from '../movie-summary/movie-summary.component';
import { MovieRatingComponent } from '../movie-rating/movie-rating.component';
import { AddToWatchlistComponent } from '../add-to-watchlist/add-to-watchlist.component';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardImage } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.component.html',
    styleUrls: ['./movie-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardImage,
    AddToWatchlistComponent,
    MovieRatingComponent,
    MovieSummaryComponent,
    SimilarMoviesComponent,
    MatButton,
    RouterLink,
    AsyncPipe,
    ConvertMinToHourPipe
],
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
