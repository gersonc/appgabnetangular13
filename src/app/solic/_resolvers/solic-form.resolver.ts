import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {SolicitacaoAlterarInterface} from "../../solicitacao/_models";
// import {SolicitacaoFormService, SolicitacaoService} from "../../solicitacao/_services";
import {DropdownService} from "../../_services";
import {mergeMap, take} from "rxjs/operators";
import {DropdownnomeidClass} from "../../_models";
import {SolicFormI} from "../_models/solic-form-i";
import {VersaoService} from "../../_services/versao.service";
import {SolicFormService} from "../_services/solic-form.service";
import {SolicForm} from "../_models/solic-form";

@Injectable({
  providedIn: 'root'
})
export class SolicFormResolver implements Resolve<SolicFormI> {
  private resp = new Subject<SolicFormI>();
  private resp$ = this.resp.asObservable();
  sub: Subscription[] = [];
  esperar = 0;
  solicitacao_id = 0;
  solicitacao: SolicFormI;
  dados = true;
  cf = new SolicForm();
  contador = 3;

  constructor(
    // private solicitacaoService: SolicitacaoService,
    // private sfs: SolicitacaoFormService,
    private solicFormService: SolicFormService,
    private router: Router,
    private dd: DropdownService,
    private vs: VersaoService
  ) {
    console.log('resolver');
  }

  espera() {
    console.log('contador', this.contador);
    this.contador--;
    if (this.contador < 1) {
      this.resp.next(this.cf);
      console.log('resolver2');
      this.resp.complete();
    }
  }

  carregaDados() {
    if (!sessionStorage.getItem('dropdown-tipo_cadastro-incluir')) {
      this.sub.push(this.dd.getDropdownCadastroTipoIncluir()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('dropdown-tipo_cadastro-incluir', JSON.stringify(dados));
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera();
          }
        })
      );
    } else {
      this.espera();
    }

    const ddNomeIdArray = new DropdownnomeidClass();

    // ****** solicitacao_assunto_id *****
    if (!sessionStorage.getItem('dropdown-assunto')) {
      ddNomeIdArray.add('solicitacao_assunto_id', 'assunto', 'assunto_id', 'assunto_nome');
    }
    // ****** solicitacao_atendente_cadastro_id *****
    if (!sessionStorage.getItem('dropdown-atendente')) {
      ddNomeIdArray.add('solicitacao_atendente_cadastro_id', 'usuario', 'usuario_id', 'usuario_nome');
    }
    if (this.vs.versao === 1) {
      // ****** solicitacao_tipo_recebimento_id *****
      if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
        ddNomeIdArray.add('solicitacao_tipo_recebimento_id', 'tipo_recebimento', 'tipo_recebimento_id', 'tipo_recebimento_nome');
      }
    }
    if (this.vs.versao < 3) {
      // ****** solicitacao_local_id *****
      if (!sessionStorage.getItem('dropdown-local')) {
        ddNomeIdArray.add('solicitacao_local_id', 'local', 'local_id', 'local_nome');
      }
    }
    // ****** solicitacao_area_interesse_id *****
    if (!sessionStorage.getItem('dropdown-area_interesse')) {
      ddNomeIdArray.add('solicitacao_area_interesse_id', 'area_interesse', 'area_interesse_id', 'area_interesse_nome');
    }

    if (ddNomeIdArray.count() > 0) {
      this.sub.push(this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['solicitacao_assunto_id']) {
              sessionStorage.setItem('dropdown-assunto', JSON.stringify(dados['solicitacao_assunto_id']));
            }
            if (dados['solicitacao_atendente_cadastro_id']) {
              sessionStorage.setItem('dropdown-atendente', JSON.stringify(dados['solicitacao_atendente_cadastro_id']));
            }
            if (this.vs.versao === 1) {
              if (dados['solicitacao_tipo_recebimento_id']) {
                sessionStorage.setItem('dropdown-tipo_recebimento', JSON.stringify(dados['solicitacao_tipo_recebimento_id']));
              }
            }
            if (this.vs.versao < 3) {
              if (dados['solicitacao_local_id']) {
                sessionStorage.setItem('dropdown-local', JSON.stringify(dados['solicitacao_local_id']));
              }
            }
            if (dados['solicitacao_area_interesse_id']) {
              sessionStorage.setItem('dropdown-area_interesse', JSON.stringify(dados['solicitacao_area_interesse_id']));
            }
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.espera();
          }
        })
      );
    } else {
      this.espera();
    }

    if (this.vs.versao < 3) {
      // ****** solicitacao_reponsavel_analize_id *****
      if (!sessionStorage.getItem('dropdown-reponsavel_analize')) {
        this.sub.push(this.dd.getDropdownResponsavel()
          .pipe(take(1))
          .subscribe({
            next: (dados) => {
              sessionStorage.setItem('dropdown-reponsavel_analize', JSON.stringify(dados));
            },
            error: err => {
              console.log(err);
            },
            complete: () => {
              this.espera();
            }
          })
        );
      } else {
        this.espera();
      }
    } else {
      this.espera();
    }
  }

  onDestroy(): void {
    this.contador = 3;
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<SolicFormI> |
    Observable<never> {
    if (route.paramMap.has('id')) {
      this.solicitacao_id = +route.paramMap.get('id');
    } else {
      this.solicFormService.resetSolicitacao();
      this.solicitacao_id = 0;
    }
      this.carregaDados();
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          if (dados) {
            this.onDestroy();
            return of(dados);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
  }
}
