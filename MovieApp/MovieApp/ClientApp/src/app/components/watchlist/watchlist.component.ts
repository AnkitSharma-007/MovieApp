import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  clearWatchlist,
  getWatchlist,
} from 'src/app/state/actions/watchlist.actions';
import { selectAuthenticatedUser } from 'src/app/state/selectors/auth.selectors';
import { selectWatchlistItems } from 'src/app/state/selectors/watchlist.selectors';
import { AddToWatchlistComponent } from '../add-to-watchlist/add-to-watchlist.component';

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
export class WatchlistComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  protected readonly watchlistItems$ = this.store.select(selectWatchlistItems);
  userId = 0;
  private destroyed$ = new ReplaySubject<void>(1);

  displayedColumns: string[] = [
    'poster',
    'title',
    'genre',
    'language',
    'action',
  ];

  ngOnInit(): void {
    this.store.dispatch(getWatchlist());
    this.store
      .select(selectAuthenticatedUser)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user) {
          this.userId = user.userId;
        }
      });
  }

  clearWatchlist() {
    this.store.dispatch(clearWatchlist({ userId: this.userId }));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
