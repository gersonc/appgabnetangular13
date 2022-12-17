import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {DdService} from "../../_services/dd.service";
import {mergeMap, take} from "rxjs/operators";
import {MensagemService} from "../_services/mensagem.service";
import {MansagemBuscaI} from "../_models/mansagem-busca-i";

@Injectable({
  providedIn: 'root'
})
export class MensagemResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();

  constructor(
    private ms: MensagemService,
    private router: Router,
    private dd: DdService,
  ) {
  }

  getMensagens() {
    const busca: MansagemBuscaI = {
      "tipo_listagem": 2,
      "todos": false,
      "rows": 50,
      "first": 0,
      "sortOrder": -1,
      "sortField": "mensagem_data2"
    }
    this.ms.criaTabela();
    this.ms.listagem_tipo = 'recebidas';
    this.ms.resetMensagemBusca();
    this.ms.novaBusca(busca);
    this.ms.buscaMenu();
  }

  populaDropdown() {
      this.sub.push(this.dd.getDd('dropdown-usuario')
        .pipe(take(1))
        .subscribe({
          next: (dados) => sessionStorage.setItem('dropdown-usuario', JSON.stringify(dados)),
          error: (err) => console.error(err),
          complete: () => this.gravaDropDown()
        })
      );
  }

  gravaDropDown() {
    this.resp.next(true);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.getMensagens();
    if (!sessionStorage.getItem('dropdown-usuario')) {
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return of(false);
          }
        })
      );
    } else {
      return of(true);
    }
  }
}
