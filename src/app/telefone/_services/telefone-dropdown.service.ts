import { Injectable } from '@angular/core';
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TelefoneDropdownService {
  dds: string[] = [];
  private sub: Subscription[] = [];
/*  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  inicio = true;*/

  constructor(
    private dd: DdService,
  ) { }

  getDD() {
    if (!sessionStorage.getItem('telefone-dropdown')) {
      this.dds.push('telefone-dropdown');
    }
    if (!sessionStorage.getItem('dropdown-local')) {
      this.dds.push('dropdown-local');
    }
    if (!sessionStorage.getItem('dropdown-usuario_nome')) {
      this.dds.push('dropdown-usuario_nome');
    }
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
            this.destroy();
          }
        )
      );
  }


  destroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
