import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';
import { UserLogin } from '../models/userLogin';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private readonly http: HttpClient,
    private readonly subscriptionService: SubscriptionService
  ) {}

  login(user: UserLogin) {
    return this.http.post<any>('/api/login', user).pipe(
      // TODO: Use a type for response object
      map((response) => {
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
          this.setUserDetails();
        }
        return response;
      }),
      shareReplay()
    );
  }

  setUserDetails() {
    const authToken = localStorage.getItem('authToken');

    if (authToken != null) {
      const userDetails = new User();
      const decodeUserDetails = JSON.parse(
        window.atob(authToken.split('.')[1])
      );

      userDetails.userId = decodeUserDetails.userId;
      userDetails.username = decodeUserDetails.name;
      userDetails.userTypeName = decodeUserDetails.sub;
      userDetails.isLoggedIn = true;
      this.subscriptionService.userData$.next(userDetails);
    }
  }

  logout() {
    localStorage.clear();
    this.resetSubscription();
  }

  private resetSubscription() {
    this.subscriptionService.userData$.next(new User());
    this.subscriptionService.watchlistItem$.next([]);
    this.subscriptionService.watchlistItemcount$.next(0);
  }
}
