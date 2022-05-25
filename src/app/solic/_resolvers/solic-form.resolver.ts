import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {mergeMap, take} from "rxjs/operators";
import {SolicFormI} from "../_models/solic-form-i";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicForm} from "../_models/solic-form";
import {DdService} from "../../_services/dd.service";

@Injectable({
  providedIn: 'root'
})
export class SolicFormResolver implements Resolve<boolean | never> {
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  sub: Subscription[] = [];
  solicitacao_id = 0;
  solicitacao: SolicFormI;
  dados = true;
  dds: string[] = [];

  constructor(
    private sfs: SolicFormService,
    private router: Router,
    private dd: DdService,
    private vs: VersaoService
  ) { }

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
    // ****** solicitacao_assunto_id *****
    if (!sessionStorage.getItem('dropdown-assunto')) {
      this.dds.push('dropdown-assunto');
    }
    // ****** solicitacao_atendente_cadastro_id *****
    if (!sessionStorage.getItem('dropdown-atendente')) {
      this.dds.push('dropdown-atendente');
    }
    if (this.vs.versao === 1) {
      // ****** solicitacao_tipo_recebimento_id *****
      if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
        this.dds.push('dropdown-tipo_recebimento');
      }
    }
    if (this.vs.versao < 3) {
      // ****** solicitacao_local_id *****
      if (!sessionStorage.getItem('dropdown-local')) {
        this.dds.push('dropdown-local');
      }
    }
    // ****** solicitacao_area_interesse_id *****
    if (!sessionStorage.getItem('dropdown-area_interesse')) {
      this.dds.push('dropdown-area_interesse');
    }

    if (this.vs.versao < 3) {
      // ****** solicitacao_reponsavel_analize_id *****
      if (!sessionStorage.getItem('dropdown-reponsavel_analize')) {
        this.dds.push('dropdown-reponsavel_analize');
      }
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach( nome => {
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
    state: RouterStateSnapshot):Observable<boolean | never> {

    if (this.sfs.acao === 'incluir') {
      this.sfs.resetSolicitacao();
      this.solicitacao_id = 0;
    }
    if (this.carregaDados()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
            console.log('resolver3');
            this.onDestroy();
            return of(dados);
        })
      );
    } else {
      console.log('resolver4');
      this.onDestroy();
      return of(false);
    }

  }
}
