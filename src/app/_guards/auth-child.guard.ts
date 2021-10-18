import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthChildGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // check if route is restricted by role
      if (route.data.rules && currentUser.rule.indexOf(route.data.rules) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // check if route is restricted by scope
      if (route.data.scopes) {
        if (route.data.scopes instanceof Array) {
          for (const rota of route.data.scopes) {
            if (currentUser.scope.indexOf(rota) !== -1) {
              return true;
            }
          }
          return false;
        } else {
          if (currentUser.scope.indexOf(route.data.scopes) === -1) {
            // role not authorised so redirect to home page
            this.router.navigate(['/']);
            return false;
          }
        }
        // authorised so return true
        return true;
      }
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
