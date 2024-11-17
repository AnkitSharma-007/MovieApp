import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserType } from 'src/app/models/userType';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
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
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly watchlistService = inject(WatchlistService);
  readonly userType = UserType;
  private destroyed$ = new ReplaySubject<void>(1);

  readonly userData$ = this.subscriptionService.userData$.asObservable();
  readonly watchlistItemcount$ = this.subscriptionService.watchlistItemcount$;

  ngOnInit(): void {
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
