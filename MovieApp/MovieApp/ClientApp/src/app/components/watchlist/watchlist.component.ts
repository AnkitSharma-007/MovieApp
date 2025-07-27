import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import {
  clearWatchlist,
  getWatchlist,
} from 'src/app/state/actions/watchlist.actions';
import { selectWatchlistItems } from 'src/app/state/selectors/watchlist.selectors';
import { AddToWatchlistComponent } from '../add-to-watchlist/add-to-watchlist.component';

@Component({
    selector: 'app-watchlist',
    templateUrl: './watchlist.component.html',
    styleUrls: ['./watchlist.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    ]
})
export class WatchlistComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly watchlistItems$ = this.store.select(selectWatchlistItems);

  displayedColumns: string[] = [
    'poster',
    'title',
    'genre',
    'language',
    'action',
  ];

  ngOnInit(): void {
    this.store.dispatch(getWatchlist());
  }

  clearWatchlist() {
    this.store.dispatch(clearWatchlist());
  }
}
