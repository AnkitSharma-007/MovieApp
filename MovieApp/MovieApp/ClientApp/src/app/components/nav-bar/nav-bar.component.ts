import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { logout } from 'src/app/state/actions/auth.actions';
import {
  selectAuthenticatedUser,
  selectIsAuthenticated,
} from 'src/app/state/selectors/auth.selectors';
import { selectWatchlistItemsCount } from 'src/app/state/selectors/watchlist.selectors';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class NavBarComponent {
  private readonly store = inject(Store);

  userState$ = combineLatest([
    this.store.select(selectIsAuthenticated),
    this.store.select(selectAuthenticatedUser),
    this.store.select(selectWatchlistItemsCount),
  ]).pipe(
    map(([isAuthenticated, user, watchlistItemsCount]) => {
      return {
        isAuthenticated,
        user,
        watchlistItemsCount,
      };
    })
  );

  logout() {
    this.store.dispatch(logout());
  }
}
