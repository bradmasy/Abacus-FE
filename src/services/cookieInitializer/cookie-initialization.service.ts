import { Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
@Injectable({
  providedIn: 'root'
})
export class CookieInitializationService {

  constructor(private ssrCookieService: SsrCookieService) { }
  initializeCookies(): Promise<any> {
    return new Promise((resolve, reject) => {
      const userId = this.ssrCookieService.get('userId');
      const token = this.ssrCookieService.get('token');

      resolve({ 'userId': userId, 'token': token }); // Resolve the promise once initialization is done
    });
  }
}
