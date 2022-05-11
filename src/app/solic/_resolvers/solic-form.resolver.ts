import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {SolicitacaoAlterarInterface} from "../../solicitacao/_models";
// import {SolicitacaoFormService, SolicitacaoService} from "../../solicitacao/_services";
import {DropdownService} from "../../_services";
import {mergeMap, take} from "rxjs/operators";
import {DropdownnomeidClass} from "../../_models";

@Injectable({
  providedIn: 'root'
})
export class SolicFormResolver implements Resolve<boolean> {
  private resp: Subject<boolean>;
  private resp$: Observable<boolean>;
  sub: Subscription[] = [];
  esperar = 0;
  solicitacao_id = 0;
  solicitacao: SolicitacaoAlterarInterface;
  dados = true;
  cf = true;
  contador = 3;

  constructor(
    // private solicitacaoService: SolicitacaoService,
    // private sfs: SolicitacaoFormService,
    private router: Router,
    private dd: DropdownService
  ) { }

  espera() {
    this.contador--;
    if (this.contador < 1) {
      this.resp.next(this.cf);
      this.resp.complete();
    }
  }

  carregaDados() {
    this.cf = true;
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      this.sub.push(this.dd.getDropdownCadastroTipoIncluir()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(dados));
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
    // ****** solicitacao_cadastrante_cadastro_id *****
    if (!sessionStorage.getItem('dropdown-cadastrante')) {
      ddNomeIdArray.add('solicitacao_cadastrante_cadastro_id', 'usuario', 'usuario_id', 'usuario_nome');
    }
    // ****** solicitacao_tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
      ddNomeIdArray.add('solicitacao_tipo_recebimento_id', 'tipo_recebimento', 'tipo_recebimento_id', 'tipo_recebimento_nome');
    }
    // ****** solicitacao_local_id *****
    if (!sessionStorage.getItem('dropdown-local')) {
      ddNomeIdArray.add('solicitacao_local_id', 'local', 'local_id', 'local_nome');
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
            if (dados['solicitacao_cadastrante_cadastro_id']) {
              sessionStorage.setItem('dropdown-cadastrante', JSON.stringify(dados['solicitacao_cadastrante_cadastro_id']));
            }
            if (dados['solicitacao_tipo_recebimento_id']) {
              sessionStorage.setItem('dropdown-tipo_recebimento', JSON.stringify(dados['solicitacao_tipo_recebimento_id']));
            }
            if (dados['solicitacao_local_id']) {
              sessionStorage.setItem('dropdown-local', JSON.stringify(dados['solicitacao_local_id']));
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

    // ****** solicitacao_reponsavel_analize_id *****
    if (!sessionStorage.getItem('dropdown-reponsavel_analize')) {
      this.sub.push(this.dd.postDropdownNomeIdWhere(
          'usuario',
          'usuario_id',
          'usuario_nome',
          'usuario_responsavel_sn',
          '=',
          '1',
          'ASC'
        )
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
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<boolean> |
    Observable<never> {
    if ( !sessionStorage.getItem('dropdown-tipo_cadastro') ||
      !sessionStorage.getItem('dropdown-assunto') ||
      !sessionStorage.getItem('dropdown-atendente') ||
      !sessionStorage.getItem('dropdown-cadastrante') ||
      !sessionStorage.getItem('dropdown-tipo_recebimento') ||
      !sessionStorage.getItem('dropdown-local') ||
      !sessionStorage.getItem('dropdown-area_interesse') ||
      !sessionStorage.getItem('dropdown-reponsavel_analize') ) {
      this.resp = null;
      this.resp = new Subject<boolean>();
      this.resp$ = this.resp.asObservable();
      this.contador = 3;
      this.carregaDados();
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      this.router.navigate(['/solic/incluir2']);
    }
  }
}