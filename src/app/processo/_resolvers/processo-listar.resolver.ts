import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import { DropdownService } from '../../_services';
import { DropdownnomeidClass, DropdownNomeIdJoin, DropdownsonomearrayClass } from '../../_models';
import { CarregadorService } from '../../_services';
import {
  ProcessoDropdownMenuListar,
  ProcessoDropdownMenuListarInterface,
  ProcessoPaginacaoInterface
} from '../_models';
import { ProcessoBuscaService, ProcessoService } from '../_services';



@Injectable({
  providedIn: 'root'
})
export class ProcessoListarResolver implements Resolve<ProcessoDropdownMenuListarInterface | ProcessoPaginacaoInterface | boolean> {
  public ddNomeIdArray = new DropdownnomeidClass();
  public ddSoNomeArray = new DropdownsonomearrayClass();
  public ddSoDataArray = new DropdownsonomearrayClass();
  private ddProcesso = new ProcessoDropdownMenuListar();
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  private dropdown = false;

  constructor(
    private router: Router,
    private dd: DropdownService,
    private cs: CarregadorService,
    private processoService: ProcessoService,
    private pbs: ProcessoBuscaService
  ) { }

  populaDropdown() {

    if (!sessionStorage.getItem('processo-dropdown')) {

      let contador = 0;


      // ****** solicitacao_data1 *****
      this.ddSoDataArray.add('ddProcesso_solicitacao_data1', 'processo_dropdown', 'solicitacao_data');
      // ****** solicitacao_data2 *****
      this.ddSoDataArray.add('ddProcesso_solicitacao_data2', 'processo_dropdown', 'solicitacao_data', 'desc');

      // ****** processo_status *****
      this.ddSoNomeArray.add('ddProcesso_status_nome', 'processo_dropdown', 'processo_status_nome', 'desc');

      // ****** processo_numero *****
      this.ddNomeIdArray.add('ddProcesso_numero', 'processo_dropdown', 'processo_id', 'processo_numero');
      // ****** processo_status *****
      // this.ddNomeIdArray.add('processo_status', 'processo_dropdown', 'processo_status_id', 'processo_status_nome');
      // ****** solicitacao_cadastro_tipo_id *****
      this.ddNomeIdArray.add('ddProcesso_cadastro_tipo_id', 'processo_dropdown', 'cadastro_tipo_id', 'cadastro_tipo_nome');
      // ****** processo_cadastro_id *****
      this.ddNomeIdArray.add('ddProcesso_cadastro_id', 'processo_dropdown', 'processo_cadastro_id', 'cadastro_nome');
      // ****** cadastro_municipio_id *****
      this.ddNomeIdArray.add('ddProcesso_cadastro_municipio_id', 'processo_dropdown', 'cadastro_municipio_id', 'cadastro_municipio_nome');
      // ****** cadastro_regiao_id *****
      this.ddNomeIdArray.add('ddProcesso_cadastro_regiao_id', 'processo_dropdown', 'cadastro_regiao_id', 'cadastro_regiao_nome');
      // ****** solicitacao_local_id*****
      this.ddNomeIdArray.add('ddProcesso_solicitacao_local_id', 'processo_dropdown', 'solicitacao_local_id', 'solicitacao_local_nome');
      // ****** solicitacao_reponsavel_analize_id *****
      this.ddNomeIdArray.add('ddProcesso_solicitacao_reponsavel_analize_id', 'processo_dropdown', 'solicitacao_reponsavel_analize_id', 'solicitacao_reponsavel_analize_nome');
      // ****** solicitacao_assunto_id *****
      this.ddNomeIdArray.add('ddProcesso_solicitacao_assunto_id', 'processo_dropdown', 'solicitacao_assunto_id', 'solicitacao_assunto_nome');
      // ****** solicitacao_area_interesse_id *****
      this.ddNomeIdArray.add('ddProcesso_solicitacao_area_interesse_id', 'processo_dropdown', 'solicitacao_area_interesse_id', 'solicitacao_area_interesse_nome');


      this.sub.push(this.dd.postDropdownSoDataFormatadoArray(this.ddSoDataArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddProcesso.ddProcesso_solicitacao_data1 = dados['ddProcesso_solicitacao_data1'];
            this.ddProcesso.ddProcesso_solicitacao_data2 = dados['ddProcesso_solicitacao_data2'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownSoNomeArray(this.ddSoNomeArray.get())
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddProcesso.ddProcesso_status_nome = dados['ddProcesso_status_nome'];
          },
          (err) => console.error(err),
          () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
            }
          }
        )
      );

      this.sub.push(this.dd.postDropdownNomeIdArray(this.ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.ddProcesso.ddProcesso_numero = dados['ddProcesso_numero'];
            this.ddProcesso.ddProcesso_cadastro_tipo_id = dados['ddProcesso_cadastro_tipo_id'];
            this.ddProcesso.ddProcesso_cadastro_id = dados['ddProcesso_cadastro_id'];
            this.ddProcesso.ddProcesso_cadastro_municipio_id = dados['ddProcesso_cadastro_municipio_id'];
            this.ddProcesso.ddProcesso_cadastro_regiao_id = dados['ddProcesso_cadastro_regiao_id'];
            this.ddProcesso.ddProcesso_solicitacao_local_id = dados['ddProcesso_solicitacao_local_id'];
            this.ddProcesso.ddProcesso_solicitacao_reponsavel_analize_id = dados['ddProcesso_solicitacao_reponsavel_analize_id'];
            this.ddProcesso.ddProcesso_solicitacao_area_interesse_id = dados['ddProcesso_solicitacao_area_interesse_id'];
            this.ddProcesso.ddProcesso_solicitacao_assunto_id = dados['solicitacao_assunto_id'];
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            contador++;
            if (contador === 3) {
              this.gravaDropDown();
            }
          }
        })
      );
    }
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('processo-dropdown')) {
      sessionStorage.setItem('processo-dropdown', JSON.stringify(this.ddProcesso));
    }
    this.resp.next(true);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.cs.escondeCarregador();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<ProcessoDropdownMenuListarInterface> |
    Observable<ProcessoPaginacaoInterface> |
    Observable<boolean> |
    Observable<never> {

    if (!sessionStorage.getItem('processo-dropdown')) {
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
      if (sessionStorage.getItem('processo-busca')) {
        this.cs.mostraCarregador();
        this.pbs.buscaState = JSON.parse(sessionStorage.getItem('processo-busca'));
        return this.processoService.postProcessoBusca(JSON.parse(sessionStorage.getItem('processo-busca')))
          .pipe(
            take(1),
            mergeMap(dados => {
              if (dados) {
                this.onDestroy();
                return of(dados);
              } else {
                this.onDestroy();
                this.router.navigate(['/processo/listar2']);
                return EMPTY;
              }
            })
          );
      } else {
        this.onDestroy();
        this.router.navigate(['/processo/listar2']);
        return EMPTY;
      }
    }
  }

}
