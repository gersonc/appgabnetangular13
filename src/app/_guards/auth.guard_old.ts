import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private aut: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.aut.vfToken) {

    }
    const currentUser = this.aut.currentUserValue;
    if (currentUser) {
      const validade = +currentUser.expires - (new Date().getTime()) / 1000;
      if (validade <= 4800) {
        this.aut.autologin().subscribe(
          data => {
            const d = data;
          },
          error => {
            const er = error;
            this.router.navigate(['/login']);
            return false;
          });
      }
      if (route.data.rules && this.aut.userScops.indexOf(route.data.rules) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
