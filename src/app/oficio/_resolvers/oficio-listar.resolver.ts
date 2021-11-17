import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { DropdownnomeidClass, DropdownNomeIdJoin, DropdownsonomearrayClass } from '../../_models';
import { CarregadorService } from '../../_services';
import { OficioDropdownMenuListar, OficioDropdownMenuListarInterface, OficioPaginacaoInterface } from '../_models';
import { OficioBuscaService, OficioService } from '../_services';


@Injectable({
  providedIn: 'root'
})
export class OficioListarResolver implements Resolve<OficioPaginacaoInterface | boolean> {
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  public ddSoDataArray = new DropdownsonomearrayClass();
  public ddNomeIdJoinArray = new DropdownNomeIdJoin();
  private ddOficio = new OficioDropdownMenuListar();
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;
  private oficios: OficioPaginacaoInterface = null;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private oficioService: OficioService,
    private obs: OficioBuscaService
  ) {
  }

  populaDropdown() {
    let contador = 0;

    if (!sessionStorage.getItem('oficio-dropdown')) {

      this.ddOficio.ddOficio_status = [
        {label: 'EM ANDAMENTO', value: 0},
        {label: 'DEFERIDO', value: 1},
        {label: 'INDEFERIDO', value: 2}
      ];

      // ****** oficio_numero *****
      this.ddSoNomeArray.add('ddOficio_numero', 'oficio', 'oficio_numero');
      // ****** oficio_protocolo_numero *****
      this.ddSoNomeArray.add('ddOficio_protocolo_numero', 'oficio', 'oficio_protocolo_numero');
      // ****** oficio_convenio *****
      this.ddSoNomeArray.add('ddOficio_convenio', 'oficio', 'oficio_convenio', 'DESC');
      // ****** oficio_orgao_solicitado_nome *****
      this.ddSoNomeArray.add('ddOficio_orgao_solicitado_nome', 'oficio', 'oficio_orgao_solicitado_nome');
      // ****** oficio_orgao_protocolante_nome *****
      this.ddSoNomeArray.add('ddOficio_orgao_protocolante_nome', 'oficio', 'oficio_orgao_protocolante_nome');

      // ****** oficio_data_emissao1 *****
      this.ddSoDataArray.add('ddOficio_data_emissao1', 'oficio', 'oficio_data_emissao');
      // ****** oficio_data_emissao2 *****
      this.ddSoDataArray.add('ddOficio_data_emissao2', 'oficio', 'oficio_data_emissao', 'DESC');
      // ****** oficio_data_empenho1 *****
      this.ddSoDataArray.add('ddOficio_data_empenho1', 'oficio', 'oficio_data_empenho');
      // ****** oficio_data_empenho2 *****
      this.ddSoDataArray.add('ddOficio_data_empenho2', 'oficio', 'oficio_data_empenho', 'DESC');
      // ****** oficio_data_protocolo1 *****
      this.ddSoDataArray.add('ddOficio_data_protocolo1', 'oficio', 'oficio_data_protocolo');
      // ****** oficio_data_protocolo2 *****
      this.ddSoDataArray.add('ddOficio_data_protocolo2', 'oficio', 'oficio_data_protocolo', 'DESC');
      // ****** oficio_data_pagamento1 *****
      this.ddSoDataArray.add('ddOficio_data_pagamento1', 'oficio', 'oficio_data_pagamento');
      // ****** oficio_data_pagamento2 *****
      this.ddSoDataArray.add('ddOficio_data_pagamento2', 'oficio', 'oficio_data_pagamento', 'DESC');
      // ****** oficio_prazo1 *****
      this.ddSoDataArray.add('ddOficio_prazo1', 'oficio', 'oficio_prazo');
      // ****** oficio_prazo2 *****
      this.ddSoDataArray.add('ddOficio_prazo2', 'oficio', 'oficio_prazo', 'DESC');

      // ****** oficio_municipio_id *****
      this.ddNomeIdArray.add('ddOficio_municipio_id', 'oficio', 'oficio_municipio_id', 'oficio_municipio_nome');
      // ****** oficio_tipo_solicitante_id *****
      this.ddNomeIdArray.add('ddOficio_tipo_solicitante_id', 'oficio', 'oficio_tipo_solicitante_id', 'oficio_tipo_solicitante_nome');
      // ****** oficio_cadastro_id *****
      this.ddNomeIdArray.add('ddOficio_cadastro_id', 'oficio', 'oficio_cadastro_id', 'oficio_cadastro_nome');
      // ****** oficio_assunto_id *****
      this.ddNomeIdArray.add('ddOficio_assunto_id', 'oficio', 'oficio_assunto_id', 'oficio_assunto_nome');
      // ****** oficio_area_interesse_id *****
      this.ddNomeIdArray.add('ddOficio_area_interesse_id', 'oficio', 'oficio_area_interesse_id', 'oficio_area_interesse_nome');
      // ****** oficio_prioridade_id *****
      this.ddNomeIdArray.add('ddOficio_prioridade_id', 'oficio', 'oficio_prioridade_id', 'oficio_prioridade_nome');
      // ****** oficio_tipo_andamento_id*****
      this.ddNomeIdArray.add('ddOficio_tipo_andamento_id', 'oficio', 'oficio_tipo_andamento_id', 'oficio_tipo_andamento_nome');

      // ****** oficio_municipio_id *****
      this.ddNomeIdArray.add('ddOficio_municipio_id', 'oficio', 'oficio_municipio_id', 'oficio_municipio_nome');
      // ****** oficio_tipo_solicitante_id *****
      this.ddNomeIdArray.add('ddOficio_tipo_solicitante_id', 'oficio', 'oficio_tipo_solicitante_id', 'oficio_tipo_solicitante_nome');
      // ****** oficio_cadastro_id *****
      this.ddNomeIdArray.add('ddOficio_cadastro_id', 'oficio', 'oficio_cadastro_id', 'oficio_cadastro_nome');
      // ****** oficio_assunto_id *****
      this.ddNomeIdArray.add('ddOficio_assunto_id', 'oficio', 'oficio_assunto_id', 'oficio_assunto_nome');
      // ****** oficio_area_interesse_id *****
      this.ddNomeIdArray.add('ddOficio_area_interesse_id', 'oficio', 'oficio_area_interesse_id', 'oficio_area_interesse_nome');
      // ****** oficio_prioridade_id *****
      this.ddNomeIdArray.add('ddOficio_prioridade_id', 'oficio', 'oficio_prioridade_id', 'oficio_prioridade_nome');
      // ****** oficio_tipo_andamento_id*****
      this.ddNomeIdArray.add('ddOficio_tipo_andamento_id', 'oficio', 'oficio_tipo_andamento_id', 'oficio_tipo_andamento_nome');

      // ****** oficio_municipio_id *****
      this.ddNomeIdArray.add('ddOficio_municipio_id', 'oficio', 'oficio_municipio_id', 'oficio_municipio_nome');
      // ****** oficio_tipo_solicitante_id *****
      this.ddNomeIdArray.add('ddOficio_tipo_solicitante_id', 'oficio', 'oficio_tipo_solicitante_id', 'oficio_tipo_solicitante_nome');
      // ****** oficio_cadastro_id *****
      this.ddNomeIdArray.add('ddOficio_cadastro_id', 'oficio', 'oficio_cadastro_id', 'oficio_cadastro_nome');
      // ****** oficio_assunto_id *****
      this.ddNomeIdArray.add('ddOficio_assunto_id', 'oficio', 'oficio_assunto_id', 'oficio_assunto_nome');
      // ****** oficio_area_interesse_id *****
      this.ddNomeIdArray.add('ddOficio_area_interesse_id', 'oficio', 'oficio_area_interesse_id', 'oficio_area_interesse_nome');
      // ****** oficio_prioridade_id *****
      this.ddNomeIdArray.add('ddOficio_prioridade_id', 'oficio', 'oficio_prioridade_id', 'oficio_prioridade_nome');
      // ****** oficio_tipo_andamento_id*****
      this.ddNomeIdArray.add('ddOficio_tipo_andamento_id', 'oficio', 'oficio_tipo_andamento_id', 'oficio_tipo_andamento_nome');

      // ****** oficio_municipio_id *****
      this.ddNomeIdArray.add('ddOficio_municipio_id', 'oficio', 'oficio_municipio_id', 'oficio_municipio_nome');
      // ****** oficio_tipo_solicitante_id *****
      this.ddNomeIdArray.add('ddOficio_tipo_solicitante_id', 'oficio', 'oficio_tipo_solicitante_id', 'oficio_tipo_solicitante_nome');
      // ****** oficio_cadastro_id *****
      this.ddNomeIdArray.add('ddOficio_cadastro_id', 'oficio', 'oficio_cadastro_id', 'oficio_cadastro_nome');
      // ****** oficio_assunto_id *****
      this.ddNomeIdArray.add('ddOficio_assunto_id', 'oficio', 'oficio_assunto_id', 'oficio_assunto_nome');
      // ****** oficio_area_interesse_id *****
      this.ddNomeIdArray.add('ddOficio_area_interesse_id', 'oficio', 'oficio_area_interesse_id', 'oficio_area_interesse_nome');
      // ****** oficio_prioridade_id *****
      this.ddNomeIdArray.add('ddOficio_prioridade_id', 'oficio', 'oficio_prioridade_id', 'oficio_prioridade_nome');
      // ****** oficio_tipo_andamento_id*****
      this.ddNomeIdArray.add('ddOficio_tipo_andamento_id', 'oficio', 'oficio_tipo_andamento_id', 'oficio_tipo_andamento_nome');

      // ****** solicitacao_reponsavel_analize_id *****
      this.ddNomeIdJoinArray.add(
        'ddSolicitacao_reponsavel_analize_id',
        'solicitacao',
        'solicitacao_reponsavel_analize_id',
        'solicitacao_id',
        'solicitacao_reponsavel_analize_nome',
        'oficio',
        'oficio_solicitacao_id',
        'LEFT OUTER JOIN');
      // ****** solicitacao_local_id *****
      this.ddNomeIdJoinArray.add(
        'ddSolicitacao_local_id',
        'solicitacao',
        'solicitacao_local_id',
        'solicitacao_id',
        'solicitacao_local_nome',
        'oficio',
        'oficio_solicitacao_id',
        'LEFT OUTER JOIN');

      // *** oficio_processo_id ***
      this.sub.push(this.dd.getDropdownOficioProcessoId()
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddOficio.ddOficio_processo_id = dados['ddOficio_processo_id'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        )
      );

      // *** oficio_codigo ***
      this.sub.push(this.dd.getDropdownOficioCodigo()
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddOficio.ddOficio_codigo = dados['ddOficio_codigo'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddOficio.ddOficio_numero = dados['ddOficio_numero'];
            this.ddOficio.ddOficio_protocolo_numero = dados['ddOficio_protocolo_numero'];
            this.ddOficio.ddOficio_convenio = dados['ddOficio_convenio'];
            this.ddOficio.ddOficio_orgao_solicitado_nome = dados['ddOficio_orgao_solicitado_nome'];
            this.ddOficio.ddOficio_orgao_protocolante_nome = dados['ddOficio_orgao_protocolante_nome'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownSoDataArray(this.ddSoDataArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddOficio.ddOficio_data_emissao1 = dados['ddOficio_data_emissao1'];
            this.ddOficio.ddOficio_data_emissao2 = dados['ddOficio_data_emissao2'];
            this.ddOficio.ddOficio_data_empenho1 = dados['ddOficio_data_empenho1'];
            this.ddOficio.ddOficio_data_empenho2 = dados['ddOficio_data_empenho2'];
            this.ddOficio.ddOficio_data_protocolo1 = dados['ddOficio_data_protocolo1'];
            this.ddOficio.ddOficio_data_protocolo2 = dados['ddOficio_data_protocolo2'];
            this.ddOficio.ddOficio_data_pagamento1 = dados['ddOficio_data_pagamento1'];
            this.ddOficio.ddOficio_data_pagamento2 = dados['ddOficio_data_pagamento2'];
            this.ddOficio.ddOficio_prazo1 = dados['ddOficio_prazo1'];
            this.ddOficio.ddOficio_prazo2 = dados['ddOficio_prazo2'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddOficio.ddOficio_municipio_id = dados['ddOficio_municipio_id'];
            this.ddOficio.ddOficio_tipo_solicitante_id = dados['ddOficio_tipo_solicitante_id'];
            this.ddOficio.ddOficio_cadastro_id = dados['ddOficio_cadastro_id'];
            this.ddOficio.ddOficio_assunto_id = dados['ddOficio_assunto_id'];
            this.ddOficio.ddOficio_area_interesse_id = dados['ddOficio_area_interesse_id'];
            this.ddOficio.ddOficio_prioridade_id = dados['ddOficio_prioridade_id'];
            this.ddOficio.ddOficio_tipo_andamento_id = dados['ddOficio_tipo_andamento_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        })
      );

      this.sub.push(this.dd.postDropdownNomeIdJoinArray(this.ddNomeIdJoinArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddOficio.ddSolicitacao_reponsavel_analize_id = dados['ddSolicitacao_reponsavel_analize_id'];
            this.ddOficio.ddSolicitacao_local_id = dados['ddSolicitacao_local_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 6) {
              this.gravaDropDown();
            }
          }
        })
      );
    } else {
      contador = contador + 6;
      if (contador === 6) {
        this.gravaDropDown();
      }
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('oficio-dropdown')) {
      sessionStorage.setItem('oficio-dropdown', JSON.stringify(this.ddOficio));
    }
    this.cs.escondeCarregador();
    this.resp.next(true);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<OficioPaginacaoInterface> | Observable<boolean> | Observable<never> {

    if (!sessionStorage.getItem('oficio-dropdown')) {
      this.dropdown = true;
      this.cs.mostraCarregador();
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
      if (sessionStorage.getItem('oficio-busca')) {
        this.cs.mostraCarregador();
        // this.obs.buscaState = JSON.parse(sessionStorage.getItem('oficio-busca'));
        return this.oficioService.postOficioBusca(JSON.parse(sessionStorage.getItem('oficio-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              this.onDestroy();
              if (dados) {
                return of(dados);
              } else {
                this.onDestroy();
                // this.router.navigate(['/oficio/listar2']);
                return EMPTY;
              }
            })
          );
      } else {
        this.onDestroy();
        this.router.navigate(['/oficio/listar2']);
        return EMPTY;
      }
    }
  }
}
