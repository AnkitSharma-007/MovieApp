import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private destroyed$ = new ReplaySubject<void>(1);
  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService
      .fecthMovieData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
