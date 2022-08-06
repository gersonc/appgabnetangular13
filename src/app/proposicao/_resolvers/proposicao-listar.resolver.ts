import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import {DdService} from "../../_services/dd.service";



@Injectable({
  providedIn: 'root'
})
export class ProposicaoListarResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  dds: string[] = [];

  constructor(
    private router: Router,
    private dd: DdService,
  ) {  }


  populaDropdown() {
    this.dds = [];
    // ****** tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-situacao_proposicao')) {
      this.dds.push('dropdown-situacao_proposicao');
    }
    // ****** ogu_id *****
    if (!sessionStorage.getItem('dropdown-orgao_proposicao')) {
      this.dds.push('dropdown-orgao_proposicao');
    }

    if (!sessionStorage.getItem('proposicao-menu-dropdown')) {
      this.dds.push('proposicao-menu-dropdown');
    }


    if (this.dds.length > 0) {
      // this.sub.push(this.dd.getDd('proposicao-menu-dropdown')
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe((dados) => {
            // sessionStorage.setItem('proposicao-menu-dropdown', JSON.stringify(dados));
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
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




  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!sessionStorage.getItem('proposicao-menu-dropdown') || !sessionStorage.getItem('dropdown-situacao_proposicao') || !sessionStorage.getItem('dropdown-orgao_proposicao')) {
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
      return of(true);
    }
  }
}
