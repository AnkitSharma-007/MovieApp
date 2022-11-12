import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-manage-movies',
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.scss'],
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

  constructor(private readonly movieService: MovieService) {
    this.movieService.movies$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movie) => (this.dataSource.data = movie));
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
