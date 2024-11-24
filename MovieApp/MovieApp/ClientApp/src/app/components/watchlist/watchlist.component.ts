import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { AddToWatchlistComponent } from '../add-to-watchlist/add-to-watchlist.component';
import { RouterLink } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import {
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
} from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectAuthenticatedUser } from 'src/app/state/selectors/auth.selectors';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    RouterLink,
    AddToWatchlistComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    AsyncPipe,
  ],
})
export class WatchlistComponent implements OnDestroy {
  private readonly store = inject(Store);

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
    this.store
      .select(selectAuthenticatedUser)
      .pipe(
        switchMap((user) => {
          if (user) {
            return this.watchlistService.clearWatchlist(user.userId);
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
