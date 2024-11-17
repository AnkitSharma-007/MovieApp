import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { selectCurrentMovieDetails } from 'src/app/state/selectors/movie.selectors';
import { ConvertMinToHourPipe } from '../../pipes/convert-min-to-hour.pipe';
import { AddToWatchlistComponent } from '../add-to-watchlist/add-to-watchlist.component';
import { MovieRatingComponent } from '../movie-rating/movie-rating.component';
import { MovieSummaryComponent } from '../movie-summary/movie-summary.component';
import { SimilarMoviesComponent } from '../similar-movies/similar-movies.component';

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
    ConvertMinToHourPipe,
  ],
})
export class MovieDetailsComponent {
  private readonly store = inject(Store);
  private readonly subscriptionService = inject(SubscriptionService);

  movieDetails$ = combineLatest([
    this.store.select(selectCurrentMovieDetails),
    this.subscriptionService.userData$.asObservable(),
  ]).pipe(
    map(([movie, userData]) => {
      if (movie === undefined) {
        return null;
      } else {
        return {
          movie,
          userData,
        };
      }
    })
  );
}
