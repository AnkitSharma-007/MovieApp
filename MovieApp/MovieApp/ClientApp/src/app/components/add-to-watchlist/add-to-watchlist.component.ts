import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-add-to-watchlist',
  templateUrl: './add-to-watchlist.component.html',
  styleUrls: ['./add-to-watchlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToWatchlistComponent implements OnDestroy {
  @Input()
  movieId = 0;

  toggle = false;
  buttonText = '';
  fontIcon = 'add_circle';
  private destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private readonly watchlistService: WatchlistService,
    private readonly subscriptionService: SubscriptionService,
    private readonly snackBarService: SnackbarService
  ) {}

  ngOnChanges() {
    this.subscriptionService.watchlistItem$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((bookData: Movie[]) => {
        this.setFavourite(bookData);
        this.setButtonText();
      });
  }

  setFavourite(bookData: Movie[]) {
    const favBook = bookData.find((f) => f.movieId === this.movieId);

    if (favBook) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }
  }

  setButtonText() {
    if (this.toggle) {
      this.buttonText = 'Remove from Wishlist';
      this.fontIcon = 'remove_circle';
    } else {
      this.buttonText = 'Add to Wishlist';
      this.fontIcon = 'add_circle';
    }
  }

  toggleValue() {
    this.toggle = !this.toggle;
    this.setButtonText();

    this.subscriptionService.userData$
      .asObservable()
      .pipe(
        switchMap((user) => {
          const userId = user.userId;
          if (userId > 0) {
            return this.watchlistService.toggleWatchlistItem(
              userId,
              this.movieId
            );
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          if (this.toggle) {
            this.snackBarService.showSnackBar('Item added to your Wishlist');
          } else {
            this.snackBarService.showSnackBar(
              'Item removed from your Wishlist'
            );
          }
        },
        error: (error) => {
          console.error('Error ocurred while setting the Watchlist : ', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
