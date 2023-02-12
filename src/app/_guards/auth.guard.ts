import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';
// import { AutenticacaoService } from "../_services/autenticacao.service";
import { take } from "rxjs/operators";
// import { AutorizaService } from "../_services/autoriza.service";
import { RefTokenService } from "../_services/ref-token.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private rfs: RefTokenService,
    private auth: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("AuthGuard", this.rfs.vfRefExp());
    if (this.rfs.vfRefExp()) {
      this.auth.mostraPermissoes();
      if (route.data.rules && this.auth.userScops.indexOf(route.data.rules) === -1) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
      /*const validade = +this.aut.expires - (new Date().getTime()) / 1000;
      if (validade <= 4800) {
        let vf: boolean;
        this.aut.refleshToken().pipe(take(1)).subscribe({
            next: (d) => {
              vf = d;
            },
            error: err => {
              const er = err;
              this.router.navigate(['/login']);
              return false;
            },
            complete: () => {
              if (!vf) {
                this.auth.logout();
                this.router.navigate(['/login']);
                return vf;
              } else {
                if (route.data.rules && this.auth.userScops.indexOf(route.data.rules) === -1) {
                  this.router.navigate(['/']);
                  return false;
                } else {
                  return true;
                }
              }
            }
          }
        );
      } else {
        if (route.data.rules && this.auth.userScops.indexOf(route.data.rules) === -1) {
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }
    } else {
      if (this.aut.rtkvalido) {
        let vf2: boolean;
        this.aut.refleshToken().pipe(take(1)).subscribe({
            next: (d) => {
              vf2 = d;
            },
            error: err => {
              const er = err;
              this.router.navigate(['/login']);
              return false;
            },
            complete: () => {
              if (!vf2) {
                this.auth.logout();
                this.router.navigate(['/login']);
                return vf2;
              } else {
                if (route.data.rules && this.auth.userScops.indexOf(route.data.rules) === -1) {
                  this.router.navigate(['/']);
                  return false;
                } else {
                  return true;
                }
              }
            }
          }
        );*/
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
}
