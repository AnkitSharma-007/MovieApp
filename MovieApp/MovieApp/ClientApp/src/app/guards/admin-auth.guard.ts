import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserType } from '../models/userType';
import { SubscriptionService } from '../services/subscription.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private subscriptionService: SubscriptionService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.subscriptionService.userData$.pipe(
      map((user) => {
        if (user.userTypeName === UserType.Admin) {
          return true;
        }
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const url = `/${route.path}`;

    return this.subscriptionService.userData$.pipe(
      map((user) => {
        if (user.userTypeName === UserType.Admin) {
          return true;
        }
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: url },
        });
        return false;
      })
    );
  }
}
