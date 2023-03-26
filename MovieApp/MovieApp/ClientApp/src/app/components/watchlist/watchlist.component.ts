import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistComponent implements OnDestroy {
  private destroyed$ = new ReplaySubject<void>(1);
  watchlistItems$ = this.subscriptionService.watchlistItem$;

  displayedColumns: string[] = [
    'poster',
    'title',
    'genre',
    'language',
    'action',
  ];

  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly subscriptionService: SubscriptionService,
    private readonly snackBarService: SnackbarService
  ) {}

  clearWatchlist() {
    this.subscriptionService.userData$
      .asObservable()
      .pipe(
        switchMap((user) => {
          const userId = user.userId;
          if (userId > 0) {
            return this.watchlistService.clearWatchlist(userId);
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          this.snackBarService.showSnackBar('Watchlist cleared!!!');
        },
        error: (error) => {
          console.error('Error ocurred while deleting the Watchlist : ', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
