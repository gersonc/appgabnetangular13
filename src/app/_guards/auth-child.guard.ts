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
      // console.log('AuthChildGuard1', route.data.rules);
      // console.log('AuthChildGuard2', this.authenticationService.userScops);
      if (route.data.rules && this.authenticationService.userScops.indexOf(route.data.rules) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // check if route is restricted by scope
      // console.log('AuthChildGuard3', route.data.scopes);
      // console.log('AuthChildGuard4', this.authenticationService.userScops);

      if (route.data.scopes) {
        if (route.data.scopes instanceof Array) {
          for (const rota of route.data.scopes) {
            // console.log('AuthChildGuard5', rota);
            if (this.authenticationService.userRules.indexOf(rota) !== -1) {
              return true;
            }
          }
          return false;
        } else {
          if (this.authenticationService.userRules.indexOf(route.data.scopes) === -1) {
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
