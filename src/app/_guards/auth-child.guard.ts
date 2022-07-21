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
    if (this.authenticationService.usuario_principal_sn, this.authenticationService.usuario_responsavel_sn) {
      return true;
    }
    if (currentUser) {
      if (route.data.rules && this.authenticationService.userScops.indexOf(route.data.rules) === -1) {
        this.router.navigate(['/']);
        return false;
      }
      if (route.data.scopes) {
        if (route.data.scopes instanceof Array) {
          for (const rota of route.data.scopes) {
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
