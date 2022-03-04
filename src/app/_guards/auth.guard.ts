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
    // console.log('guard0',this.authenticationService.currentUserValue);
    if (currentUser) {
      // console.log('guard1');
      const validade = +currentUser.expires - (new Date().getTime()) / 1000;
      if (validade <= 604800) {
        // console.log('guard2');
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
      // if (route.data.rules && currentUser.rule.indexOf(route.data.rules) === -1) {
      // console.log('guard3', route.data.rules);
      // console.log('guard4', this.authenticationService.userScops);
      // console.log('guard5', this.authenticationService.userScops.indexOf(route.data.rules));
      if (route.data.rules && this.authenticationService.userScops.indexOf(route.data.rules) === -1) {
        // console.log('guard6');
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // console.log('guard7');
      // authorised so return true
      return true;
    }
    // console.log('guard8');
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
