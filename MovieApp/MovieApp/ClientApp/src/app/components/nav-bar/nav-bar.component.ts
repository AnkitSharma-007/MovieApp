import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserType } from 'src/app/models/userType';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  readonly userType = UserType;
  private destroyed$ = new ReplaySubject<void>(1);

  readonly userData$ = this.subscriptionService.userData$.asObservable();
  readonly watchlistItemcount$ = this.subscriptionService.watchlistItemcount$;

  constructor(
    private readonly movieService: MovieService,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly subscriptionService: SubscriptionService,
    private readonly watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.movieService
      .fetchMovieData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();

    this.subscriptionService.userData$
      .asObservable()
      .pipe(
        switchMap((user: User) => {
          const userId = user.userId;
          if (userId > 0) {
            return this.watchlistService.getWatchlistItems(userId);
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        error: (error) => {
          console.error('Error ocurred while setting the Watchlist : ', error);
        },
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
