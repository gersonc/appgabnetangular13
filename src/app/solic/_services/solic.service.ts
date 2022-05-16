import { Injectable } from '@angular/core';
import {TituloHelper, UrlService} from "../../_services";
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
import {Observable, Subscription} from "rxjs";
import {BuscaCampoI} from "../../shared-datatables/models/busca-campo-i";
import {TotalI} from "../../shared-datatables/models/total-i";
import {SolicDetalheI} from "../_models/solic-detalhe-i";
import {TSMap} from "typescript-map";
import {SolicFormI} from "../_models/solic-form-i";

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
  titulos: TSMap<string, TSMap<string, string>>;
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
    if (typeof(this.titulos) === 'undefined') {
      if (!sessionStorage.getItem('solic-detalhe-titulos')) {
        this.sub.push(this.getTitulosDetalhe()
          .pipe(take(1))
          .subscribe(dados => {
              this.titulos = TituloHelper.set(dados, 'solic-detalhe-titulos');
              // console.log('TituloHelper.set', this.titulos);
          }));
      } else {
        this.titulos = TituloHelper.get('solic-detalhe-titulos');
        // console.log('TituloHelper.get', this.titulos);
      }
    }

  }

  getTitulosDetalhe() {
    const url = this.solicitacaoUrl + '/titulosdetalhe';
    return this.http.get<any[]>(url);
  }

  getSolicitacaoDetalhe(id: number) {
    const url = this.solicitacaoUrl + '/detalhe/' + id;
    return this.http.get<SolicDetalheI>(url);
  }

  incluirSolicitacao(dados: SolicFormI): Observable<any> {
    let url: string;
    url = this.url.solicitacao + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  postVerificarNumOficio(dados: any): Observable<any> {
    let url: string;
    url = this.url.solicitacao + '/verificanumoficio';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }
}
