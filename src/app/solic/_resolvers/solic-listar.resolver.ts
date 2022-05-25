import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {mergeMap, take} from "rxjs/operators";
import {SolicPaginacaoInterface} from "../_models/solic-listar-i";
import {SolicService} from "../_services/solic.service";
import {DdService} from "../../_services/dd.service";

@Injectable({
  providedIn: 'root'
})
export class SolicListarResolver implements  Resolve<boolean | SolicPaginacaoInterface> {
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;


  constructor(
    private router: Router,
    private solicitacaoService: SolicService,
    private dd: DdService
  ) { }

  populaDropdown() {
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      this.sub.push(this.dd.getDd('solic-menu-dropdown')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('solic-menu-dropdown', JSON.stringify(dados));
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


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<SolicPaginacaoInterface> |
    Observable<boolean> |
    Observable<never> {
    // this.solicitacaoService.getTitulos();
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
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
    } else {
      if (sessionStorage.getItem('datatable-busca')) {
        return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('datatable-busca')))
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
        this.router.navigate(['/solic/listar2']);
        return EMPTY;
      }
    }
  };
}
