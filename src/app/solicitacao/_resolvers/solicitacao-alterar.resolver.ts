import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject, pipe } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve, RouterState } from '@angular/router';
import { SolicitacaoService, SolicitacaoFormService } from '../_services';
import { SelectItem } from 'primeng/api';
import { DropdownnomeidClass } from '../../_models';
import { SolicitacaoAlterarFormulario, SolicitacaoAlterarInterface, SolicitacaoInterface } from '../_models';
import {CarregadorService, DropdownService} from '../../_services';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoAlterarResolver implements OnDestroy, Resolve<SolicitacaoAlterarInterface> {
  resposta = new Subject<SolicitacaoAlterarInterface>();
  resposta$ = this.resposta.asObservable();
  sub: Subscription[] = [];
  esperar = 0;
  solicitacao_id = 0;
  solicitacao: SolicitacaoAlterarInterface;


  constructor(
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private sfs: SolicitacaoFormService,
    private router: Router,
    private dd: DropdownService
  ) {
  }

  espera() {
    this.esperar++;
    if (this.esperar === 4) {
      this.esperar = 0;
      this.resposta.next(this.solicitacao);
    }
  }

  carregaDados(id) {
    this.solicitacao_id = id;
    const ddNomeIdArray = new DropdownnomeidClass();

    this.sfs.criarAlterar();
    this.sub.push(this.solicitacaoService.getSolicitacaoAlterar(this.solicitacao_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.solicitacao = dados;
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.espera();
        }
      })
    );

    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {

      let ddTipoCadastroId: SelectItem[];

      const d = {
        tabela: 'tipo_cadastro',
        campo_id: 'tipo_cadastro_id',
        campo_nome: 'tipo_cadastro_nome',
        campo_pesquisa: 'tipo_cadastro_tipo',
        valor_pesquisa: 0
      };

      this.sub.push(this.dd.postDropdown3campos(d)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            ddTipoCadastroId = dados;
          },
          error: (erro) => {
            console.log(erro);
          },
          complete: () => {
            sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(ddTipoCadastroId));
            this.espera();
          }
        })
      );
    } else {
      setTimeout(() => {
        this.espera();
      }, 200);
    }

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
      setTimeout(() => {
        this.espera();
      }, 200);
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
      setTimeout(() => {
        this.espera();
      }, 200);
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<SolicitacaoAlterarInterface> | Observable<never> {
    this.cs.mostraCarregador();
    if (route.paramMap.get('id')) {
      this.carregaDados(route.paramMap.get('id'));
    }
    return this.resposta.pipe(
      take(1),
      mergeMap(dados => {
          this.ngOnDestroy();
          this.cs.escondeCarregador();
          return of(dados);
      })
    );
  }
}

