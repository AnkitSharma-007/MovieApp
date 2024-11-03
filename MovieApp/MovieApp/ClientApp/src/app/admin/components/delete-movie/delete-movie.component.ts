import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-delete-movie',
    templateUrl: './delete-movie.component.html',
    styleUrls: ['./delete-movie.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe
],
})
export class DeleteMovieComponent implements OnDestroy {
  movieData$ = this.movieService.getMovieById(this.movieid);

  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly movieid: number,
    private readonly movieService: MovieService
  ) {}

  confirmDelete(): void {
    this.movieService
      .deleteMovie(this.movieid)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        error: (error) =>
          console.error('Error ocurred while deleting movie data : ', error),
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
