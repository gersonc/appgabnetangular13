import { OnDestroy, Injectable} from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject, pipe } from 'rxjs';
import {take, mergeMap, map, tap} from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve, RouterState } from '@angular/router';
import { SolicitacaoService, SolicitacaoFormService } from '../_services';
import {SelectItem, SelectItemGroup} from 'primeng/api';
import { DropdownnomeidClass } from '../../util/_models';
import { SolicitacaoAlterarFormulario, SolicitacaoAlterarInterface, SolicitacaoInterface } from '../_models';
import { DropdownService } from '../../util/_services';
import {CarregadorService} from '../../_services';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoFormResolver implements Resolve<boolean> {
  resposta = new Subject<boolean>();
  resposta$ = this.resposta.asObservable();
  sub: Subscription[] = [];
  esperar = 0;
  solicitacao_id = 0;
  solicitacao: SolicitacaoAlterarInterface;
  dados = true;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private cs: CarregadorService,
    private sfs: SolicitacaoFormService,
    private router: Router,
    private dd: DropdownService
  ) {
  }

  espera() {
    this.esperar++;
    if (this.esperar === 3) {
      this.esperar = 0;
      setTimeout(() => {
        this.resposta.next(true);
      }, 500);
    }
  }

  carregaDados() {
    if (!sessionStorage.getItem('dropdown-tipo_cadastro')) {
      const tpcad: SelectItemGroup[] = [];
      const a = [1, 2];
      let tipo: SelectItemGroup;
      let c = 0;
      for (const b of a) {

        this.sub.push(this.dd.getDropdown3campos(
          'cadastro',
          'cadastro_tipo',
          'cadastro_tipo_nome',
          'cadastro_tipo_tipo',
          String(b)
          ).pipe(take(1))
            .subscribe({
              next: (dados) => {
                tipo = {
                  label: dados['label'].toString(),
                  value: null,
                  items: dados['items']
                };
                tpcad.push(tipo);
              },
              error: (err) => {
                console.error(err);
              },
              complete: () => {
                c++;
                if (c === 2) {
                  sessionStorage.setItem('dropdown-tipo_cadastro', JSON.stringify(tpcad));
                  this.espera();
                }
              }
            })
        );
      }
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
        ['ASC']
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
    state: RouterStateSnapshot): Observable<boolean> | Observable<never> {
    this.carregaDados();
    return this.resposta$.pipe(
      take(1),
      mergeMap(dados => {
        if (dados) {
          // this.cs.fechaMenu();
          // this.cs.mostraCarregador();
          this.onDestroy();
          return of(dados);
        } else {
          // this.cs.fechaMenu();
          this.onDestroy();
          return EMPTY;
        }
      })
    );
  }
}

