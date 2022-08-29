import { Injectable } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProposicaoMenuDropdownService {
  dds: any[];
  resp = new Subject<boolean>();
  resp$ = this.resp.asObservable();
  sub: Subscription[] = [];
  inicio = false;

  constructor(
    private dd: DdService
  ) { }

  getDropdownMenu() {
    this.inicio = true;
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
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe((dados) => {
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
    if (!sessionStorage.getItem('dropdown-situacao_proposicao') || !sessionStorage.getItem('dropdown-orgao_proposicao') || !sessionStorage.getItem('proposicao-menu-dropdown')) {
      if (!this.inicio) {
        this.getDropdownMenu();
      }
    } else {
      this.dds = undefined;
      this.sub.forEach(s => {
        s.unsubscribe()
      });
      this.inicio = false;
      this.resp.next(true);
      this.resp.complete();
    }
  }
}
