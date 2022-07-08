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
import {HistFormI, HistI, HistListI} from "../../hist/_models/hist-i";
import {strToDelta} from "../../_models/parcer-delta";
import {HistAuxService} from "../../hist/_services/hist-aux.service";

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
  solicitacoes: SolicListarI[] = [];
  selecionados: SolicListarI[] = [];
  Contexto: SolicListarI;
  busca?: SolicBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: SolicListarI;
  expandidoSN = false;
  solicitacaoApagar?: SolicListarI;
  solicitacaoAnalisar?: SolicListarI;


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private has: HistAuxService
  ) {
    this.criaTabela();
    this.solicitacaoUrl = this.url.solic;
  }

  buscaMenu() {
    this.buscaSubject.next(true);
  }

  criaTabela() {
    // this.ts.titulosSN();
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
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
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    let a = 0;
    const b: any[] = [];
    let ev = evento.data;
    this.has.histFormI = {
      hist: {
        historico_processo_id: +evento.data.processo_id,
        historico_solicitacao_id: +evento.data.solicitacao_id
      }
    };
    this.tabela.titulos.forEach((t, i, tt) => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].toString().length > 0) {
          const m = this.tabela.camposTexto.indexOf(t.field);
          const tit = t.titulo;
          let vf = false;
          let txtdelta: string = null;
          let txt: string = null;
          let tst = '';
          tst = ev[t.field].toString();
          b.push([tit, tst, vf, txt, txtdelta]);
          a++;
        }
      }
    });
    this.tabela.dadosExpandidos = b;
    this.expandidoSN = true;
  }

  onRowCollapse(ev) {
    delete this.has.histFormI;
    delete this.has.histListI;
    this.tabela.dadosExpandidos = null;
    this.expandidoSN = false;
  }




  onStateRestore(tableSession: any) {
    console.log('onStateRestore->');
    if (tableSession !== undefined) {
      this.parseSession(tableSession);
    }
    this.stateSN = false;
    const t: any = JSON.parse(sessionStorage.getItem('solic-tabela'));
    const b: any = JSON.parse(sessionStorage.getItem('solic-busca'));
    this.parseTabela(t);
    this.parseBusca(b);
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
    this.stateSN = true;
    sessionStorage.setItem('solic-busca', JSON.stringify(this.busca));
    sessionStorage.setItem('solic-tabela', JSON.stringify(this.tabela));
  }

  parseTabela(t: any) {
    console.log('parseTabela->', t);
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
          this.tabela.expandedRowKeys = js[k];
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
    /*if (this.ts.titulos.length === 0) {
      this.ts.buscaTitulos(cps);
    } else {
      if (this.tabela.titulos === undefined || this.tabela.titulos.length === 0) {
        this.tabela.titulos = this.ts.buscaTitulos(cps);
      }
    }*/
  }

  solicitacaoBusca(): void {
    console.log('1tabela.first->', this.tabela.first);
    console.log('1busca.first->', this.busca.first);
    console.log('1tabela.rows->', this.tabela.rows);
    console.log('1busca.rows->', this.busca.rows);
    console.log('1tabela.currentPage->', this.tabela.currentPage);
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
    console.log('2tabela.first->', this.tabela.first);
    console.log('2busca.first->', this.busca.first);
    console.log('2tabela.rows->', this.tabela.rows);
    console.log('2busca.rows->', this.busca.rows);
    console.log('2tabela.currentPage->', this.tabela.currentPage);
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
          console.log('3tabela.first->', this.tabela.first);
          console.log('3busca.first->', this.busca.first);
          console.log('3tabela.rows->', this.tabela.rows);
          console.log('3busca.rows->', this.busca.rows);
          console.log('3tabela.currentPage->', this.tabela.currentPage);
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

  postVerificarNumProesso(dados: any): Observable<any> {
    let url: string;
    url = this.url.proce + '/validarnum';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  getSgstNumProcesso(): Observable<any> {
    const url = this.url.proce + '/sugestnum';
    return this.http.get<any>(url);
  }

  recebeRegistro(h: HistFormI) {
    if (h.modulo === 'solicitacao') {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.solicitacoes[h.idx].historico_solicitcao)) {
          this.solicitacoes[h.idx].historico_solicitcao.push(h.hist);
        } else {
          this.solicitacoes[h.idx].historico_solicitcao = [h.hist];
        }
      }
      if (h.acao === 'alterar') {
        const m: HistI[] = this.solicitacoes[h.idx].historico_solicitcao;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.solicitacoes[h.idx].historico_solicitcao.splice(n, 1, h.hist);
      }
      if (h.acao === 'apagar') {
        const m: HistI[] = this.solicitacoes[h.idx].historico_solicitcao;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.solicitacoes[h.idx].historico_solicitcao.splice(n, 1);
      }
    }
    if (h.modulo === 'processo') {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.solicitacoes[h.idx].historico_processo)) {
          this.solicitacoes[h.idx].historico_processo.push(h.hist);
        } else {
          this.solicitacoes[h.idx].historico_processo = [h.hist];
        }
      }
      if (h.acao === 'alterar') {
        const m: HistI[] = this.solicitacoes[h.idx].historico_processo;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.solicitacoes[h.idx].historico_processo.splice(n, 1, h.hist);
      }
      if (h.acao === 'apagar') {
        this.solicitacoes[h.idx].historico_processo.splice(this.solicitacoes[h.idx].historico_processo.findIndex(hs => hs.historico_id = h.hist.historico_id), 1);
      }
    }
  }

  montaHistorico(modulo: string, idx: number) {
    this.has.histFormI.modulo = modulo;
    this.has.histFormI.idx = idx;
    this.has.histListI = {
      idx: idx,
      modulo: modulo,
      hist: (modulo === 'processo') ? this.expandido.historico_processo : this.expandido.historico_solicitcao,
      registro_id: (modulo === 'processo') ? +this.expandido.processo_id : +this.expandido.solicitacao_id
    }
  }

  onDestroy(): void {
    sessionStorage.removeItem('solic-busca');
    sessionStorage.removeItem('solic-tabela');
    sessionStorage.removeItem('solic-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.has = null;
    this.sub.forEach(s => s.unsubscribe());
  }
}
