import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {mergeMap, take} from "rxjs/operators";
import {DdService} from "../../_services/dd.service";
import {EmendaFormService} from "../_services/emenda-form.service";
import {VersaoService} from "../../_services/versao.service";

@Injectable({
  providedIn: 'root'
})
export class EmendaFormResolver implements Resolve<boolean | never> {
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  sub: Subscription[] = [];
  dados = true;
  dds: string[] = [];


  constructor(
    private efs: EmendaFormService,
    private router: Router,
    private dd: DdService,
    private vs: VersaoService
  ) {

  }

  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }


  carregaDados(): boolean {
    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      this.dds.push('dropdown-tipo_cadastro');
    }
    // ****** assunto_id *****
    if (!sessionStorage.getItem('dropdown-assunto')) {
      this.dds.push('dropdown-assunto');
    }
    // ****** emenda_tipo_emenda_id *****
    if (!sessionStorage.getItem('dropdown-tipo_emenda')) {
      this.dds.push('dropdown-tipo_emenda');
    }
    if (!sessionStorage.getItem('dropdown-emenda_situacao')) {
      this.dds.push('dropdown-emenda_situacao');
    }
    // ****** tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
      this.dds.push('dropdown-tipo_recebimento');
    }

    if (this.vs.solicitacaoVersao < 3) {
      // ****** local_id *****
      if (!sessionStorage.getItem('dropdown-local')) {
        this.dds.push('dropdown-local');
      }
    }
    // ****** ogu_id *****
    if (!sessionStorage.getItem('dropdown-ogu')) {
      this.dds.push('dropdown-ogu');
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

    if (this.efs.acao === 'incluir') {
      this.efs.resetEmenda();
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
