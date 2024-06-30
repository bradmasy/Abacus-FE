import { Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})

export class SessionService {

  constructor(private ssrCookieService: SsrCookieService) {
  }

  /**
   * Returns whether the session is live or not. A live session is defined as a user who is logged in the application.
   */
  isLive = (): boolean => {
    return this.getUserId() !== ''; 
  }

  /**
   * Sets the uses session userID as a cookie.
   * @param userId: a string/GUID that represents the users ID in the database
   */
  setUserId(userId: string): void {
    this.ssrCookieService.set('userId', userId);
  }

  getUserId(): string {
    return this.ssrCookieService.get('userId');
  }

  setToken(token: string): void {
    this.ssrCookieService.set('token', token);
  }

  getToken(): string {
    return this.ssrCookieService.get('token');
  }

  logout = () => {
    this.ssrCookieService.delete("userId")
    this.ssrCookieService.delete("token")
  }
}