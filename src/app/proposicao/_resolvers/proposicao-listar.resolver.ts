import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../util/_services';
import { DropdownnomeidClass, DropdownNomeIdJoin, DropdownsonomearrayClass } from '../../util/_models';
import { CarregadorService } from '../../_services';
import { ProposicaoDropdownMenuListar, ProposicaoDropdownMenuListarInterface, ProposicaoPaginacaoInterface } from '../_models';
import { ProposicaoBuscaService, ProposicaoService } from '../_services';
import {EmendaPaginacaoInterface} from "../../emenda/_models";


@Injectable({
  providedIn: 'root'
})
export class ProposicaoListarResolver implements Resolve<any[] | boolean | ProposicaoPaginacaoInterface> {
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  public ddSoDataArray = new DropdownsonomearrayClass();
  private ddProposicao = new ProposicaoDropdownMenuListar();
  private sub: Subscription[] = [];
  private resp = new Subject<ProposicaoPaginacaoInterface | boolean | any[]>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private proposicaoPaginacao: ProposicaoPaginacaoInterface;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private proposicaoService: ProposicaoService,
    private obs: ProposicaoBuscaService
  ) {
    console.log('proposicao2');
  }

  populaDropdown() {

    if (!sessionStorage.getItem('proposicao-dropdown')) {

      let contador = 0;

      // ****** ddProposicao_numero *****
      this.ddSoNomeArray.add('ddProposicao_numero', 'proposicao', 'proposicao_numero');
      // ****** ddProposicao_autor *****
      this.ddSoNomeArray.add('ddProposicao_autor', 'proposicao', 'proposicao_autor');
      // ****** ddProposicao_relator *****
      this.ddSoNomeArray.add('ddProposicao_relator', 'proposicao', 'proposicao_relator');
      // ****** ddProposicao_parecer *****
      this.ddSoNomeArray.add('ddProposicao_parecer', 'proposicao', 'proposicao_parecer');
      // ****** ddProposicao_relator_atual *****
      this.ddSoNomeArray.add('ddProposicao_relator_atual', 'proposicao', 'proposicao_relator_atual');

      // ****** ddProposicao_tipo_id *****
      this.ddNomeIdArray.add('ddProposicao_tipo_id', 'proposicao', 'proposicao_tipo_id', 'proposicao_tipo_nome');
      // ****** ddProposicao_area_interesse_id *****
      this.ddNomeIdArray.add('ddProposicao_area_interesse_id', 'proposicao', 'proposicao_area_interesse_id', 'proposicao_area_interesse_nome');
      // ****** ddProposicao_origem_id *****
      this.ddNomeIdArray.add('ddProposicao_origem_id', 'proposicao', 'proposicao_origem_id', 'proposicao_origem_nome');
      // ****** ddProposicao_emenda_tipo_id *****
      this.ddNomeIdArray.add('ddProposicao_emenda_tipo_id', 'proposicao', 'proposicao_emenda_tipo_id', 'proposicao_emenda_tipo_nome');
      // ****** ddProposicao_situacao_id *****
      this.ddNomeIdArray.add('ddProposicao_situacao_id', 'proposicao', 'proposicao_situacao_id', 'proposicao_situacao_nome');
      // ****** ddProposicao_orgao_id *****
      this.ddNomeIdArray.add('ddProposicao_orgao_id', 'proposicao', 'proposicao_orgao_id', 'proposicao_orgao_nome');

      // ****** proposicao_data1 *****
      this.ddSoDataArray.add('ddProposicao_data1', 'proposicao', 'proposicao_data_apresentacao');
      // ****** oficio_data_emissao2 *****
      this.ddSoDataArray.add('ddProposicao_data2', 'proposicao', 'proposicao_data_apresentacao', 'DESC');



      this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddProposicao.ddProposicao_numero = dados['ddProposicao_numero'];
            this.ddProposicao.ddProposicao_autor = dados['ddProposicao_autor'];
            this.ddProposicao.ddProposicao_relator = dados['ddProposicao_relator'];
            this.ddProposicao.ddProposicao_parecer = dados['ddProposicao_parecer'];
            this.ddProposicao.ddProposicao_relator_atual = dados['ddProposicao_relator_atual'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 4) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddProposicao.ddProposicao_tipo_id = dados['ddProposicao_tipo_id'];
            this.ddProposicao.ddProposicao_area_interesse_id = dados['ddProposicao_area_interesse_id'];
            this.ddProposicao.ddProposicao_origem_id = dados['ddProposicao_origem_id'];
            this.ddProposicao.ddProposicao_emenda_tipo_id = dados['ddProposicao_emenda_tipo_id'];
            this.ddProposicao.ddProposicao_area_interesse_id = dados['ddProposicao_area_interesse_id'];
            this.ddProposicao.ddProposicao_situacao_id = dados['ddProposicao_situacao_id'];
            this.ddProposicao.ddProposicao_orgao_id = dados['ddProposicao_orgao_id'];
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

      this.sub.push(this.dd.postDropdownSoDataArray(this.ddSoDataArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddProposicao.ddProposicao_data1 = dados['ddProposicao_data1'];
            this.ddProposicao.ddProposicao_data2 = dados['ddProposicao_data2'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 4) {
              this.gravaDropDown();
            }
          }
        )
      );

      if (sessionStorage.getItem('proposicao-busca')) {
        this.cs.mostraCarregador();
        this.obs.buscaState = JSON.parse(sessionStorage.getItem('proposicao-busca'));
        this.proposicaoService.postProposicaoBusca(JSON.parse(sessionStorage.getItem('proposicao-busca')))
          .pipe(take(1))
          .subscribe(
            (dados) => {
                this.proposicaoPaginacao = dados;
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 4) {
              this.gravaDropDown();
            }
          });
      } else {
        contador++;
        if (contador === 4) {
          this.gravaDropDown();
        }
      }
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('proposicao-dropdown')) {
      sessionStorage.setItem('proposicao-dropdown', JSON.stringify(this.ddProposicao));
    }
    if (this.proposicaoPaginacao) {
      this.resp.next(this.proposicaoPaginacao);
    } else {
      this.resp.next(true);
    }
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<any[] | boolean | ProposicaoPaginacaoInterface> {
    if (!sessionStorage.getItem('proposicao-dropdown')) {
      this.dropdown = true;
      this.cs.mostraCarregador();
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            return of(vf);
          } else {
            return EMPTY;
          }
        })
      );
    } else {
      if (sessionStorage.getItem('proposicao-busca')) {
        this.cs.mostraCarregador();
        this.obs.buscaState = JSON.parse(sessionStorage.getItem('proposicao-busca'));
        return this.proposicaoService.postProposicaoBusca(JSON.parse(sessionStorage.getItem('proposicao-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                return of(dados);
              } else {
                this.router.navigate(['/proposicao/busca']);
                return EMPTY;
              }
            })
          );
      } else {
        // this.router.navigate(['/proposicao/busca']);
        return EMPTY;
      }
    }
  }

}
