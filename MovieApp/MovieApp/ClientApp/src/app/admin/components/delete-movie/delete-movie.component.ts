import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteMovie } from 'src/app/state/actions/movie.actions';
import { selectMovieById } from 'src/app/state/selectors/movie.selectors';

@Component({
    selector: 'app-delete-movie',
    templateUrl: './delete-movie.component.html',
    styleUrls: ['./delete-movie.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        AsyncPipe,
    ]
})
export class DeleteMovieComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteMovieComponent>);
  private readonly movieid = inject<number>(MAT_DIALOG_DATA);
  private readonly store = inject(Store);

  movieData$ = this.store.select(selectMovieById(this.movieid));

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.store.dispatch(deleteMovie({ movieId: this.movieid }));
  }
}
