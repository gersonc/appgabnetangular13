import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {ProceService} from "../_services/proce.service";
import {DdService} from "../../_services/dd.service";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProceListarResolver implements Resolve<boolean> {
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;

  constructor(
    private router: Router,
    private ps: ProceService,
    private dd: DdService
  ) {
    // this.ps.criaTabela();
  }

  populaDropdown() {
    if (!sessionStorage.getItem('proce-menu-dropdown')) {
      this.sub.push(this.dd.getDd('proce-menu-dropdown')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('proce-menu-dropdown', JSON.stringify(dados));
          },
          (err) => console.error(err),
          () => {
            this.gravaDropDown();
          }
        )
      );
    } else {
      this.gravaDropDown();
    }
  }

  gravaDropDown() {
    this.resp.next(true);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }






  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  |  Observable<never> {
    if (!sessionStorage.getItem('proce-menu-dropdown')) {
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
    }/* else {
      if (sessionStorage.getItem('datatable-busca')) {
        return this.ps.postProceBusca(JSON.parse(sessionStorage.getItem('datatable-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                return of(dados);
              } else {
                return EMPTY;
              }
            })
          );
      } else {
        this.router.navigate(['/proce/listar2']);
        return EMPTY;
      }
    }*/
  };
}
