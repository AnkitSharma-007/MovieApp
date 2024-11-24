import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserLogin } from '../models/userLogin';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly subscriptionService = inject(SubscriptionService);

  login(user: UserLogin) {
    return this.http.post<any>('/api/login', user);
  }

  // TODO: Remove this function once state setup is complete.
  logout() {
    this.resetSubscription();
  }

  private resetSubscription() {
    this.subscriptionService.watchlistItem$.next([]);
    this.subscriptionService.watchlistItemcount$.next(0);
  }
}
