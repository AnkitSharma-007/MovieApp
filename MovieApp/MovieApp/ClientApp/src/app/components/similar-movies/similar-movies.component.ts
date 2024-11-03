import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-similar-movies',
    templateUrl: './similar-movies.component.html',
    styleUrls: ['./similar-movies.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        NgIf,
        NgFor,
        MovieCardComponent,
        MatProgressSpinner,
        AsyncPipe,
    ],
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
