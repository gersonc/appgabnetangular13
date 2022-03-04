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
      console.log('AuthChildGuard1', route.data.rules);
      console.log('AuthChildGuard2', this.authenticationService.userScops, this.authenticationService.userScops.indexOf(route.data.rules) === -1);
      if (route.data.rules && this.authenticationService.userScops.indexOf(route.data.rules) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      console.log('AuthChildGuard3', route.data.scopes);
      if (route.data.scopes) {
        if (route.data.scopes instanceof Array) {
          for (const rota of route.data.scopes) {
            console.log('AuthChildGuard5', rota);
            if (this.authenticationService.userRules.indexOf(rota) !== -1) {
              return true;
            }
          }
          return false;
        } else {
          if (this.authenticationService.userRules.indexOf(route.data.scopes) === -1) {
            this.router.navigate(['/']);
            return false;
          }
        }
        return true;
      }
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
