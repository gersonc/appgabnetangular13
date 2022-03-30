import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  SolicListarI,
  SolicPaginacaoInterface,
  solicSolicitacaoCamposTexto,
  SolicTotalInterface
} from "../_models/solic-listar-i";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {SolicDatatableService} from "./solic-datatable.service";
import {take} from "rxjs/operators";
import {SolicBuscaService} from "./solic-busca.service";
import {Subscription} from "rxjs";
import {SolicBuscaCampoI} from "../_models/solic-busca-campo-i";

@Injectable({
  providedIn: 'root'
})
export class SolicService {
  solicitacaoUrl = this.url.solic;
  sub: Subscription[] = [];
  solicitacoes: SolicListarI[];
  camposSelecionados: SolicBuscaCampoI[];
  selecionados: SolicListarI[] = [];
  total: SolicTotalInterface;
  Contexto: SolicListarI;
  // expandidoDados: any = false;



  constructor(
    private url: UrlService,
    private http: HttpClient,
    private sds: SolicDatatableService,
    private sbs: SolicBuscaService
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


  getSolicitacaoDetalhe(id: number) {

  }



  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
