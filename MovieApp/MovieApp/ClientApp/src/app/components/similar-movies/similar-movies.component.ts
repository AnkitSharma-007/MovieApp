import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { getsimilarMovies } from 'src/app/state/actions/similar-movies.action';
import { selectSimilarMovies } from 'src/app/state/selectors/similar-movie.selectors';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
    selector: 'app-similar-movies',
    templateUrl: './similar-movies.component.html',
    styleUrls: ['./similar-movies.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MovieCardComponent,
        MatProgressSpinner,
        AsyncPipe,
    ]
})
export class SimilarMoviesComponent {
  private readonly store = inject(Store);
  protected readonly similarMovies$ = this.store.select(selectSimilarMovies);

  constructor() {
    this.store.dispatch(getsimilarMovies());
  }
}
