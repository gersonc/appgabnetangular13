import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  SolicListarI,
  SolicPaginacaoInterface,
  solicSolicitacaoCamposTexto
} from "../_models/solic-listar-i";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {DatatableService} from "../../shared-datatables/services/datatable.service";
import {take} from "rxjs/operators";
import {BuscaService} from "../../shared-datatables/services/busca.service";
import {Subscription} from "rxjs";
import {BuscaCampoI} from "../../shared-datatables/models/busca-campo-i";
import {TotalI} from "../../shared-datatables/models/total-i";
import {SolicitacaoAlterarInterface} from "../../solicitacao/_models";

@Injectable({
  providedIn: 'root'
})
export class SolicService {
  solicitacaoUrl = this.url.solic;
  sub: Subscription[] = [];
  // solicitacoes: SolicListarI[];
  solicitacoes: SolicListarI[];
  camposSelecionados: BuscaCampoI[];
  selecionados: SolicListarI[] = [];
  total: TotalI;
  Contexto: SolicListarI;
  titulos: any;
  // expandidoDados: any = false;



  constructor(
    private url: UrlService,
    private http: HttpClient,
    private sds: DatatableService,
    private sbs: BuscaService
  ) {
    this.solicitacaoUrl = this.url.solic;
    this.sds.sortCampo = 'solicitacao_posicao2';
    this.sds.camposTexto = solicSolicitacaoCamposTexto;
  }

  solicitacaoBusca(): void {
    this.sbs.busca['campos'] = this.camposSelecionados;
    // this.cs.mostraCarregador();
    this.sub.push(this.postSolicitacaoBusca(this.sbs.busca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.solicitacoes = dados.solicitacao;
          this.sds.total = dados.total;
          this.sds.totalRecords = this.sds.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.sbs.busca.todos = this.sds.tmp;
          this.sds.currentPage = (
              parseInt(this.sbs.busca.inicio, 10) +
              parseInt(this.sbs.busca.numlinhas, 10)) /
              parseInt(this.sbs.busca.numlinhas, 10);
          this.sds.numerodePaginas = Math.ceil(this.sds.totalRecords / this.sds.rows);
          // this.cs.escondeCarregador();
        }
      })
    );
  }





  postSolicitacaoBusca(busca: SolicBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.solicitacaoUrl + '/listar';
    return this.http.post<SolicPaginacaoInterface>(url, busca, httpOptions);
  }


  getTitulos(): void {
    if (!this.titulos) {
      if (!sessionStorage.getItem('solic-listagem-titulos')) {
        this.sub.push(this.getTitulosDetalhe()
          .pipe(take(1))
          .subscribe(dados => {
            sessionStorage.setItem('solic-listagem-titulos', JSON.stringify(dados));
            this.titulos = dados;
          }));
      } else {
        this.titulos = JSON.parse(sessionStorage.getItem('solic-listagem-titulos'));
      }
    }
  }

  getTitulosDetalhe() {
    const url = this.solicitacaoUrl + '/titulosdetalhe';
    return this.http.get<any[]>(url);
  }


  getSolicitacaoDetalhe(id: number) {

  }



  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
