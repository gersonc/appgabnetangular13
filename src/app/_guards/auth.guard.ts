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
      if (route.data.rules && this.authenticationService.userScops.indexOf(route.data.rules) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
