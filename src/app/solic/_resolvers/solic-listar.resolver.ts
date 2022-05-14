import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {DropdownService} from "../../_services";
import {mergeMap, take} from "rxjs/operators";
import {SolicPaginacaoInterface} from "../_models/solic-listar-i";
import {SolicitacaoDropdownMenuListar, SolicitacaoDropdownMenuListarInterface} from "../../solicitacao/_models";
import {SolicService} from "../_services/solic.service";
import {SolicDropdownMenuListarI} from "../_models/solic-dropdown-menu-listar-i";

@Injectable({
  providedIn: 'root'
})
export class SolicListarResolver implements  Resolve<boolean | SolicPaginacaoInterface> {

  private solicitacaoDropdownMenu: SolicitacaoDropdownMenuListarInterface;
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;


  constructor(
    private router: Router,
    // private cs: CarregadorService,
    private solicitacaoService: SolicService,
    private dd: DropdownService
  ) { }

  populaDropdown() {
    /*if (!sessionStorage.getItem('dropdown-reponsavel_analize')) {
      this.sub.push(this.dd.getDropdownResponsavel()
        .pipe(take(1))
        .subscribe(dados => sessionStorage.setItem('dropdown-reponsavel_analize', JSON.stringify(dados))));
    }*/
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      this.sub.push(this.dd.getDropdownSolicitacaoMenuTodos()
        .pipe(take(1))
        .subscribe((dados) => {
            this.solicitacaoDropdownMenu = dados;
          },
          (err) => console.error(err),
          () => {
            this.gravaDropDown();
          }
        )
      );
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      sessionStorage.setItem('solic-menu-dropdown', JSON.stringify(this.solicitacaoDropdownMenu));
    }
    this.resp.next(true);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
/*
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
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      sessionStorage.setItem('solic-menu-dropdown', JSON.stringify(this.ddSolicitacao));
    }
    this.resp.next(true);
  }

  onDestroy() {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

*/


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<SolicPaginacaoInterface> |
    Observable<boolean> |
    Observable<never> {
    this.solicitacaoService.getTitulos();
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
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
      if (sessionStorage.getItem('datatable-busca')) {
        return this.solicitacaoService.postSolicitacaoBusca(JSON.parse(sessionStorage.getItem('datatable-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                return of(dados);
              } else {
                return EMPTY;
              }
            })
          );
      } else {
        this.router.navigate(['/solic/listar2']);
        return EMPTY;
      }
    }
  };
}
