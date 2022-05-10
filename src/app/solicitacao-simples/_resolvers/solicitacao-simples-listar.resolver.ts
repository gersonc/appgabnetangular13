import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {DropdownnomeidClass, DropdownNomeIdJoin, DropdownsonomearrayClass} from "../../_models";
import {SolicitacaoDropdownMenuListar, SolicitacaoPaginacaoInterface} from "../../solicitacao/_models";
import {CarregadorService, DropdownService} from "../../_services";
import {SolicitacaoService} from "../../solicitacao/_services";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoSimplesListarResolver implements Resolve<boolean | SolicitacaoPaginacaoInterface> {
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  public ddSoDataArray = new DropdownsonomearrayClass();
  public ddNomeIdJoinArray = new DropdownNomeIdJoin();
  private ddSolicitacao = new SolicitacaoDropdownMenuListar();
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;


  constructor(
    private router: Router,
    private cs: CarregadorService,
    private solicitacaoService: SolicitacaoService,
    private dd: DropdownService
  ) { }

  private populaDropdown() {
    let contador = 0;
    // contador++;

    this.sub.push(this.dd.getDropdownSolCadTipo()
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          console.log(dados);
          this.ddSolicitacao.ddSolicitacao_cadastro_tipo_id = dados;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          contador++;
          if (contador === 4) {
            this.gravaDropDown();
          }
        }
      })
    );

    // ****** solicitacao_posicao *****
    this.ddSoNomeArray.add('ddSolicitacao_posicao', 'solicitacao', 'solicitacao_posicao');
    // ****** solicitacao_data *****
    this.ddSoNomeArray.add('ddSolicitacao_data', 'solicitacao', 'solicitacao_data');
    // ****** solicitacao_cadastro_tipo_id *****
    // this.ddNomeIdArray.add('ddSolicitacao_cadastro_tipo_id', 'solicitacao', 'solicitacao_cadastro_tipo_id', 'solicitacao_cadastro_tipo_nome');
    // ****** solicitacao_cadastro_id *****
    this.ddNomeIdArray.add('ddSolicitacao_cadastro_id', 'solicitacao', 'solicitacao_cadastro_id', 'solicitacao_cadastro_nome');
    // ****** solicitacao_assunto_id *****
    this.ddNomeIdArray.add('ddSolicitacao_assunto_id', 'solicitacao', 'solicitacao_assunto_id', 'solicitacao_assunto_nome');
    // ****** solicitacao_atendente_cadastro_id *****
    this.ddNomeIdArray.add('ddSolicitacao_atendente_cadastro_id', 'solicitacao', 'solicitacao_atendente_cadastro_id', 'solicitacao_atendente_cadastro_nome');
    // ****** ddSolicitacao_cadastrante_cadastro *****
    this.ddNomeIdArray.add('ddSolicitacao_cadastrante_cadastro_id', 'solicitacao', 'solicitacao_cadastrante_cadastro_id', 'solicitacao_cadastrante_cadastro_nome');
    // ****** solicitacao_local*****
    this.ddNomeIdArray.add('ddSolicitacao_local_id', 'solicitacao', 'solicitacao_local_id', 'solicitacao_local_nome');
    // ****** solicitacao_tipo_recebimento *****
    this.ddNomeIdArray.add('ddSolicitacao_tipo_recebimento_id', 'solicitacao', 'solicitacao_tipo_recebimento_id', 'solicitacao_tipo_recebimento_nome');
    // ****** solicitacao_area_interesse *****
    this.ddNomeIdArray.add('ddSolicitacao_area_interesse_id', 'solicitacao', 'solicitacao_area_interesse_id', 'solicitacao_area_interesse_nome');
    // ****** solicitacao_reponsavel_analize *****
    this.ddNomeIdArray.add('ddSolicitacao_reponsavel_analize_id', 'solicitacao', 'solicitacao_reponsavel_analize_id', 'solicitacao_reponsavel_analize_nome');

    // ****** solicitacao_assunto_id *****
    this.ddNomeIdJoinArray.add('ddCadastro_municipio_id', 'cadastro', 'cadastro_municipio_id', 'cadastro_id', 'cadastro_municipio_nome', 'solicitacao', 'solicitacao_cadastro_id');
    // ****** cadastro_regiao *****
    this.ddNomeIdJoinArray.add('ddCadastro_regiao_id', 'cadastro', 'cadastro_regiao_id', 'cadastro_id', 'cadastro_regiao_nome', 'solicitacao', 'solicitacao_cadastro_id');

    this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.ddSolicitacao.ddSolicitacao_posicao = dados['ddSolicitacao_posicao'];
          this.ddSolicitacao.ddSolicitacao_data = dados['ddSolicitacao_data'];
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          contador++;
          if (contador === 4) {
            this.gravaDropDown();
          }
        }
      })
    );

    this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          // this.ddSolicitacao.ddSolicitacao_cadastro_tipo_id = dados['ddSolicitacao_cadastro_tipo_id'];
          this.ddSolicitacao.ddSolicitacao_cadastro_id = dados['ddSolicitacao_cadastro_id'];
          this.ddSolicitacao.ddSolicitacao_assunto_id = dados['ddSolicitacao_assunto_id'];
          this.ddSolicitacao.ddSolicitacao_atendente_cadastro_id = dados['ddSolicitacao_atendente_cadastro_id'];
          this.ddSolicitacao.ddSolicitacao_cadastrante_cadastro_id = dados['ddSolicitacao_cadastrante_cadastro_id'];
          this.ddSolicitacao.ddSolicitacao_local_id = dados['ddSolicitacao_local_id'];
          this.ddSolicitacao.ddSolicitacao_tipo_recebimento_id = dados['ddSolicitacao_tipo_recebimento_id'];
          this.ddSolicitacao.ddSolicitacao_area_interesse_id = dados['ddSolicitacao_area_interesse_id'];
          this.ddSolicitacao.ddSolicitacao_reponsavel_analize_id = dados['ddSolicitacao_reponsavel_analize_id'];
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          contador++;
          if (contador === 4) {
            this.gravaDropDown();
          }
        }
      })
    );

    this.sub.push(this.dd.postDropdownNomeIdJoinArray(this.ddNomeIdJoinArray.get())
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.ddSolicitacao.ddCadastro_municipio_id = dados['ddCadastro_municipio_id'];
          this.ddSolicitacao.ddCadastro_regiao_id = dados['ddCadastro_regiao_id'];
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          contador++;
          if (contador === 4) {
            this.gravaDropDown();
          }
        }
      })
    );

  }

  gravaDropDown() {
    if (!sessionStorage.getItem('solicitacao-dropdown')) {
      sessionStorage.setItem('solicitacao-dropdown', JSON.stringify(this.ddSolicitacao));
    }
    this.cs.escondeCarregador();
    this.resp.next(true);
  }

  onDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }



  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<SolicitacaoPaginacaoInterface> |
    Observable<boolean> |
    Observable<never> {
    if (!sessionStorage.getItem('solicitacao-dropdown')) {
      this.cs.mostraCarregador();
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          this.cs.escondeCarregador();
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
    } else {
      if (sessionStorage.getItem('solicitacao-busca')) {
        this.cs.mostraCarregador();
        return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('solicitacao-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              this.cs.escondeCarregador();
              if (dados) {
                return of(dados);
              } else {
                return EMPTY;
              }
            })
          );
      } else {
        this.cs.escondeCarregador();
        this.router.navigate(['/solicitacaosimples/listar2']);
        return EMPTY;
      }
    }
  }
}
