import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SolicListarI, SolicPaginacaoInterface, solicSolicitacaoCamposTexto} from "../_models/solic-listar-i";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {take} from "rxjs/operators";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {SolicDetalheI} from "../_models/solic-detalhe-i";
import {SolicFormI} from "../_models/solic-form-i";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TitulosService} from "../../_services/titulos.service";
import {UrlService} from "../../_services";
import {SolicFormAnalisar} from "../_models/solic-form-analisar-i";
import {HistListI} from "../../hist/_models/hist-i";

@Injectable({
  providedIn: 'root'
})
export class SolicService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  solicitacaoUrl = this.url.solic;
  sub: Subscription[] = [];
  detalhe?: SolicListarI;
  solicitacoes: SolicListarI[];
  selecionados: SolicListarI[] = [];
  Contexto: SolicListarI;
  busca?: SolicBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  solicitacaoApagar?: SolicListarI;
  solicitacaoAnalisar?: SolicListarI;


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService
  ) {
    this.criaTabela();
    this.solicitacaoUrl = this.url.solic;
  }

  buscaMenu() {
    this.buscaSubject.next(true);
  }

  criaTabela() {
    this.ts.titulosSN();
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      console.log('criaTabela');
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'solicitacao_situacao, solicitacao_cadastro_nome';
        this.tabela.camposTexto = solicSolicitacaoCamposTexto;
        if (this.busca === undefined) {
          this.criaBusca();
        }

      }
    }
  }

  resetTabela() {
    this.tabela = undefined;
    this.criaTabela();
  }

  criaBusca() {
    if (this.busca === undefined) {
      this.busca = {
        todos: false,
        rows: this.tabela.rows
      };
    }
  }

  resetSolicitacaoBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  onContextMenuSelect(event) {
    this.Contexto = event.data;
  }

  onRowExpand(evento) {
    console.log('onRowExpand', evento);
    let a = 0;
    const b: any[] = [];
    let ev = evento.data;
    this.buscaIdx(ev.solicitacao_id);
    // this.tabela.dadosExpandidos = evento.data;
    this.tabela.titulos.forEach((t, i, tt) => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].toString().length > 0) {
          const m = this.tabela.camposTexto.indexOf(t.field);
          // let jj: any[] = [];
          const tit = t.titulo;
          let vf = false;
          let txtdelta: string = null;
          let txt: string = null;
          let tst = '';
          // jj.push(this.tabela.titulos[n].toString());
          if (m >= 0) {
            let keyidx: string[] = [
              this.tabela.camposTexto[m],
              this.tabela.camposTexto[m] + '_texto',
              this.tabela.camposTexto[m] + '_delta'
            ];
            tst = (ev[keyidx[1]] !== undefined && ev[keyidx[1]] !== null) ? ev[keyidx[1]] : ev[keyidx[0]];
            txt = (ev[keyidx[1]] !== undefined && ev[keyidx[1]] !== null) ? ev[ev[keyidx[1]]] : null;
            txtdelta = (ev[keyidx[2]] !== undefined && ev[keyidx[2]] !== null) ? ev[ev[keyidx[2]]] : null;
            vf = true;
          } else {
            tst = ev[t.field].toString();
          }
          b.push([tit, tst, vf, txt, txtdelta]);
          a++;
        }
      }
    });
    this.tabela.dadosExpandidos = b;

  }

  buscaIdx(id: number) {
    this.idx =  this.solicitacoes.findIndex(d => {d.solicitacao_id = id});
  }

  onRowCollapse(ev) {
    this.tabela.dadosExpandidos = undefined;
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      this.parseSession(tableSession);
    }
    this.stateSN = false;
    const t: any = JSON.parse(sessionStorage.getItem('solic-tabela'));
    const b: any = JSON.parse(sessionStorage.getItem('solic-busca'));
    this.parseTabela(t);
    this.parseBusca(b);
  }

  setState() {
    this.stateSN = true;
    sessionStorage.setItem('solic-busca', JSON.stringify(this.busca));
    sessionStorage.setItem('solic-tabela', JSON.stringify(this.tabela));
  }

  parseTabela(t: any) {
    sessionStorage.removeItem('solic-tabela');
    this.tabela.rows = parseInt(t.rows, 10);
    this.tabela.first = parseInt(t.first, 10);
    this.tabela.sortOrder = parseInt(t.sortOrder, 10);
    this.tabela.sortField = t.sortField;
    this.tabela.todos = (t.todos.toString() === 'true');
    this.tabela.campos = t.campos;
    this.tabela.ids = (t.ids !== undefined)? t.ids : undefined;
    this.tabela.totalRecords = parseInt(t.totalRecords, 10);
    this.tabela.currentPage = parseInt(t.currentPage, 10);
    this.tabela.pageCount = parseInt(t.pageCount, 10);
    this.tabela.titulos = t.titulos;
    this.tabela.camposTexto = t.camposTexto;
    this.tabela.total = t.total;
    if (t.dadosExpandidos !== undefined) {
      this.tabela.dadosExpandidos = t.dadosExpandidos;
    }
    if (t.todos === 'true' || t.todos === true) {
      this.busca.todos = true;
      this.tabela.todos = true;
    } else {
      this.busca.todos = false;
      this.tabela.todos = false;
    }
  }

  parseSession(js: any) {
    Object.keys(js).forEach((k ) => {
      switch (k) {
        case 'first': {
          this.busca.first = parseInt(js[k], 10);
          break;
        }
        case 'rows': {
          this.busca.rows = parseInt(js[k], 10);
          break;
        }
        case 'sortOrder': {
          this.busca.sortOrder = parseInt(js[k], 10);
          break;
        }
        case 'currentPage': {
          this.tabela.currentPage = parseInt(js[k], 10);
          break;
        }
        case 'pageCount': {
          this.tabela.pageCount = parseInt(js[k], 10);
          break;
        }
        case 'expandedRowKeys': {
          this.tabela.pageCount = parseInt(js[k], 10);
          break;
        }
        case 'sortField': {
          if (js[k] !== undefined && js[k] !== '') {
            this.busca.sortField = js[k];
            break;
          }
        }
      }

    });
  }

  parseBusca(b: SolicBuscaI) {
    sessionStorage.removeItem('solic-busca');
    this.busca.solicitacao_situacao = (b.solicitacao_situacao !== undefined)? b.solicitacao_situacao : undefined;
    this.busca.solicitacao_cadastro_tipo_id = (b.solicitacao_cadastro_tipo_id !== undefined)? +b.solicitacao_cadastro_tipo_id : undefined;
    this.busca.solicitacao_cadastro_id = (b.solicitacao_cadastro_id !== undefined)? +b.solicitacao_cadastro_id : undefined;
    this.busca.solicitacao_assunto_id = (b.solicitacao_assunto_id !== undefined)? +b.solicitacao_assunto_id : undefined;
    this.busca.solicitacao_atendente_cadastro_id = (b.solicitacao_atendente_cadastro_id !== undefined)? +b.solicitacao_atendente_cadastro_id : undefined;
    this.busca.solicitacao_cadastrante_cadastro_id = (b.solicitacao_cadastrante_cadastro_id !== undefined)? +b.solicitacao_cadastrante_cadastro_id : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined)? +b.cadastro_municipio_id : undefined;
    this.busca.cadastro_regiao_id = (b.cadastro_regiao_id !== undefined)? +b.cadastro_regiao_id : undefined;
    this.busca.solicitacao_local_id = (b.solicitacao_local_id !== undefined)? +b.solicitacao_local_id : undefined;
    this.busca.cadastro_bairro = (b.cadastro_bairro !== undefined)? b.cadastro_bairro : undefined;
    this.busca.solicitacao_tipo_recebimento_id = (b.solicitacao_tipo_recebimento_id !== undefined)? +b.solicitacao_tipo_recebimento_id : undefined;
    this.busca.solicitacao_area_interesse_id = (b.solicitacao_area_interesse_id !== undefined)? +b.solicitacao_area_interesse_id : undefined;
    this.busca.solicitacao_reponsavel_analize_id = (b.solicitacao_reponsavel_analize_id !== undefined)? +b.solicitacao_reponsavel_analize_id : undefined;
    this.busca.solicitacao_data = (b.solicitacao_data !== undefined)? b.solicitacao_data : undefined;
    this.busca.solicitacao_descricao = (b.solicitacao_descricao !== undefined)? b.solicitacao_descricao : undefined;
    this.busca.solicitacao_orgao = (b.solicitacao_orgao !== undefined)? b.solicitacao_orgao : undefined;
    this.busca.processo_numero = (b.processo_numero !== undefined)? b.processo_numero : undefined;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = cps;
    if (this.ts.titulos.length === 0) {
      this.ts.buscaTitulos(cps);
    } else {
      if (this.tabela.titulos === undefined || this.tabela.titulos.length === 0) {
        this.tabela.titulos = this.ts.buscaTitulos(cps);
      }
    }
  }

  solicitacaoBusca(): void {
    if (this.busca.rows === undefined) {
      this.busca.rows = this.tabela.rows;
    } else {
      this.tabela.rows = this.busca.rows;
    }
    if (this.busca.first === undefined) {
      this.busca.first = this.tabela.first;
    } else {
      this.tabela.first = this.busca.first;
    }
    if (this.busca.sortOrder === undefined) {
      this.busca.sortOrder = this.tabela.sortOrder;
    } else {
      this.tabela.sortOrder = this.busca.sortOrder;
    }
    if (this.busca.sortField === undefined) {
      this.busca.sortField = this.tabela.sortField;
    } else {
      this.tabela.sortField = this.busca.sortField;
    }
    if (this.busca.todos === undefined && this.tabela.todos === undefined) {
      this.busca.todos = false;
      this.tabela.todos = false;
    } else {
      if (this.busca.todos === undefined) {
        this.busca.sortField = this.tabela.sortField;
      } else {
        this.tabela.sortField = this.busca.sortField;
      }
    }
    this.tabela.ids = this.busca.ids;
    this.sub.push(this.postSolicitacaoBusca(this.busca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          // this.resetSolicitacaoBusca();
          this.solicitacoes = dados.solicitacao;
          this.tabela.total = dados.total;
          this.tabela.totalRecords = this.tabela.total.num;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.tabela.currentPage = (this.tabela.first + this.tabela.rows) / this.tabela.rows;
          this.tabela.pageCount = Math.ceil(this.tabela.totalRecords / this.tabela.rows);
          // this.cs.escondeCarregador();
        }
      })
    );
  }

  postSolicitacaoBusca(busca: SolicBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.solic + '/listar';
    return this.http.post<SolicPaginacaoInterface>(url, busca, httpOptions);
  }

  getSolicitacaoDetalhe(id: number) {
    const url = this.url.solic + '/detalhe/' + id;
    return this.http.get<SolicDetalheI>(url);
  }

  incluirSolicitacao(dados: SolicFormI): Observable<any> {
    let url: string;
    url = this.url.solic + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarSolicitacao(dados: SolicFormI): Observable<any> {
    let url: string;
    url = this.url.solic + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  analisarSolicitacao(dados: SolicFormAnalisar): Observable<any> {
    let url: string;
    url = this.url.solic + '/analisar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirSolicitacao(id: number): Observable<any> {
    const url = this.url.solic + '/' + id;
    return this.http.delete<any>(url);
  }

  postVerificarNumOficio(dados: any): Observable<any> {
    let url: string;
    url = this.url.solic + '/verificanumoficio';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  onDestroy(): void {
    console.log('onDestroy');
    sessionStorage.removeItem('solic-busca');
    sessionStorage.removeItem('solic-tabela');
    sessionStorage.removeItem('solic-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }
}
