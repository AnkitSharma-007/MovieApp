import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { getMovies } from 'src/app/state/actions/movie.actions';
import { selectMovies } from 'src/app/state/selectors/movie.selectors';
import { DeleteMovieComponent } from '../delete-movie/delete-movie.component';

@Component({
  selector: 'app-manage-movies',
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    AsyncPipe,
  ],
})
export class ManageMoviesComponent {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly searchValue$ = new BehaviorSubject<string>('');

  movieTableData$ = combineLatest([
    this.store.select(selectMovies),
    this.searchValue$,
  ]).pipe(
    map(([movies, searchValue]) => {
      let dataSource = new MatTableDataSource(movies);
      dataSource.paginator = this.paginator;
      dataSource.sort = this.sort;
      if (searchValue.length > 0) {
        dataSource.filter = searchValue.trim().toLowerCase();
        dataSource.paginator.firstPage();
      }
      return dataSource;
    })
  );

  displayedColumns: string[] = [
    'title',
    'genre',
    'language',
    'duration',
    'rating',
    'operation',
  ];

  constructor() {
    this.store.dispatch(getMovies());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue$.next(filterValue);
  }

  deleteConfirm(movieId: number): void {
    this.dialog.open(DeleteMovieComponent, {
      data: movieId,
    });
  }
}
