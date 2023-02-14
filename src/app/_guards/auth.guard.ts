import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService } from "../_services";
import { RefTokenService } from "../_services/ref-token.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private rfs: RefTokenService,
    private auth: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.rfs.vfExp()) {
      this.auth.revalida();
      if (route.data.rules !== undefined && this.auth.userRules.indexOf(route.data.rules) === -1) {
        this.router.navigate(["/"]);
        return false;
      } else {
        return true;
      }
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
