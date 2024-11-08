import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatNoDataRow,
} from '@angular/material/table';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeleteMovieComponent } from '../delete-movie/delete-movie.component';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';

@Component({
  selector: 'app-manage-movies',
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    RouterLink,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatPaginator,
  ],
})
export class ManageMoviesComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  private destroyed$ = new ReplaySubject<void>(1);

  displayedColumns: string[] = [
    'title',
    'genre',
    'language',
    'duration',
    'rating',
    'operation',
  ];
  dataSource: MatTableDataSource<Movie> = new MatTableDataSource();

  constructor(
    private readonly movieService: MovieService,
    private readonly dialog: MatDialog,
    private readonly snackBarService: SnackbarService
  ) {
    this.getAllMovieData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteConfirm(movieId: number): void {
    const dialogRef = this.dialog.open(DeleteMovieComponent, {
      width: '400px',
      data: movieId,
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.movieService.fetchMovieData();
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          this.snackBarService.showSnackBar('Movie deleted successfully.');
        },
        error: (error) => {
          this.snackBarService.showSnackBar('Unable to delete movie.');
          console.error('Error ocurred while deleting movie data : ', error);
        },
      });
  }

  private getAllMovieData() {
    this.movieService.movies$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movie: Movie[]) => (this.dataSource.data = movie));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
