import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import {DdService} from "../../_services/dd.service";
import {ProposicaoFormService} from "../_services/proposicao-form.service";


@Injectable({
  providedIn: 'root',
})
export class ProposicaoFormResolver implements Resolve<boolean | never> {
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  sub: Subscription[] = [];
  dados = true;
  dds: string[] = [];

  constructor(
    private pfs: ProposicaoFormService,
    private router: Router,
    private dd: DdService,
  ) {}

  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }

  carregaDados(): boolean {
    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();
    if (!sessionStorage.getItem('dropdown-tipo_proposicao')) {
      this.dds.push('dropdown-tipo_proposicao');
    }
    // ****** assunto_id *****
    if (!sessionStorage.getItem('dropdown-area_interesse')) {
      this.dds.push('dropdown-area_interesse');
    }
    // ****** emenda_tipo_emenda_id *****
    if (!sessionStorage.getItem('dropdown-origem_proposicao')) {
      this.dds.push('dropdown-origem_proposicao');
    }
    if (!sessionStorage.getItem('dropdown-emenda_proposicao')) {
      this.dds.push('dropdown-emenda_proposicao');
    }
    // ****** tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-situacao_proposicao')) {
      this.dds.push('dropdown-situacao_proposicaoo');
    }
    // ****** ogu_id *****
    if (!sessionStorage.getItem('dropdown-orgao_proposicao')) {
      this.dds.push('dropdown-orgao_proposicao');
    }
    if (!sessionStorage.getItem('dropdown-parecer')) {
      const ddParecer = [
        { label: 'FAVORAVEL', value: 'FAVORAVEL' },
        { label: 'NÃO FAVORAVEL', value: 'NÃO FAVORAVEL' },
        { label: 'INDEFINIDO', value: 'INDEFINIDO' },
        { label: 'NENHUM', value: 'NENHUM' },
      ];
      sessionStorage.setItem('dropdown-parecer', JSON.stringify(ddParecer));
    }


    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera(true);
          }
        })
      );
      return true;
    } else {
      // this.espera(false);
      return false
    }

  }

  onDestroy(): void {
    this.dds = [];
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | never> {

    if (this.pfs.acao === 'incluir') {
      this.pfs.resetProposicao();
    }
    if (this.carregaDados()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      this.onDestroy();
      return of(false);
    }

  }
}
