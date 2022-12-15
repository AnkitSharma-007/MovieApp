import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { UserType } from 'src/app/models/userType';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  readonly userType = UserType;
  private destroyed$ = new ReplaySubject<void>(1);

  readonly userData$ = this.subscriptionService.userData$.asObservable();

  constructor(
    private readonly movieService: MovieService,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly subscriptionService: SubscriptionService
  ) {}

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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
