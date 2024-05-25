import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionService } from '../session/session.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private sessionService: SessionService) { }

  /**
   * Determines whether to activate or deactivate the route based on the session authentication.
   * 
   * @returns returns a boolean on whether the route should be deactivated or not.
   */
  canActivate(): boolean {
    if (!this.sessionService.isLive()) {
      this.router.navigate(['/']); // Redirect to login page if not authenticated
      return false;
    }
    return true;
  }

}
