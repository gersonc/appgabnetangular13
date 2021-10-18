import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      const validade = +currentUser.expires - (new Date().getTime()) / 1000;
      if (validade <= 604800) {
        this.authenticationService.autologin().subscribe(
          data => {
            const d = data;
          },
          error => {
            const er = error;
            console.log('error->', er);
            this.router.navigate(['/login']);
            return false;
          });
      }
      // check if route is restricted by role
      if (route.data.rules && currentUser.rule.indexOf(route.data.rules) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
