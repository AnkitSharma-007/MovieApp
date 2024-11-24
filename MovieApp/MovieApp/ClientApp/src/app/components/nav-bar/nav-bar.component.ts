import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  EMPTY,
  map,
  ReplaySubject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { User } from 'src/app/models/user';
import { UserType } from 'src/app/models/userType';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { logout } from 'src/app/state/actions/auth.actions';
import {
  selectAuthenticatedUser,
  selectIsAuthenticated,
} from 'src/app/state/selectors/auth.selectors';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatAnchor,
    RouterLink,
    MatIcon,
    SearchComponent,
    MatIconButton,
    MatTooltip,
    MatBadge,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
  ],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly store = inject(Store);
  readonly userType = UserType;
  private destroyed$ = new ReplaySubject<void>(1);

  userState$ = combineLatest([
    this.store.select(selectIsAuthenticated),
    this.store.select(selectAuthenticatedUser),
  ]).pipe(
    map(([isAuthenticated, user]) => {
      return {
        isAuthenticated,
        user,
      };
    })
  );

  readonly watchlistItemcount$ = this.subscriptionService.watchlistItemcount$;

  ngOnInit(): void {
    this.store
      .select(selectAuthenticatedUser)
      .pipe(
        takeUntil(this.destroyed$),
        switchMap((user) => {
          if (user) {
            return this.watchlistService.getWatchlistItems(user.userId);
          }
          return EMPTY;
        })
      )
      .subscribe({
        error: (error) => {
          console.error('Error ocurred while setting the Watchlist : ', error);
        },
      });
  }

  logout() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
