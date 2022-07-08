import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SolicListarI,SolicPaginacaoInterface, solicSolicitacaoCamposTexto } from "../_models/solic-listar-i";
import {SolicBuscaI} from "../_models/solic-busca-i";
import {take} from "rxjs/operators";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {SolicDetalheI} from "../_models/solic-detalhe-i";
import {SolicFormI} from "../_models/solic-form-i";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TitulosService} from "../../_services/titulos.service";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {SolicFormAnalisar} from "../_models/solic-form-analisar-i";
import {HistFormI, HistI} from "../../hist/_models/hist-i";
import {HistAuxService} from "../../hist/_services/hist-aux.service";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {CelulaI} from "../../_models/celula-i";
import {CelulaService} from "../../_services/celula.service";
import {limpaTexto} from "../../shared/functions/limpa-texto";


@Injectable({
  providedIn: 'root'
})
export class SolicService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  solicitacaoUrl = this.url.solic;
  sub: Subscription[] = [];
  detalhe: SolicListarI | null = null;
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
  sortField = 'solicitacao_situacao';
  sortOrder = 1;
  lazy = false;



  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private has: HistAuxService,
    private celulaService: CelulaService
  ) {
    this.solicitacaoUrl = this.url.solic;
    this.celulaService.modulo = 'Solicitação'
  }

  buscaMenu() {
    this.solicitacaoBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'solicitacao_situacao';
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
        todos: this.tabela.todos,
        rows: this.tabela.rows,
        sortField: this.tabela.sortField,
        first: this.tabela.first,
        sortOrder: this.tabela.sortOrder
      };
    }
  }

  novaBusca(busca: SolicBuscaI) {
    if (busca === undefined) {
      this.busca = {
        todos: this.tabela.todos,
        rows: this.tabela.rows,
        sortField: this.tabela.sortField,
        first: this.tabela.first,
        sortOrder: this.tabela.sortOrder
      };
    } else {
      this.busca = undefined;
      this.busca = busca;
      this.busca.todos = this.tabela.todos;
      this.busca.rows = this.tabela.rows;
      this.busca.first = 0;
      this.busca.sortOrder = 1;
      this.busca.sortField = 'solicitacao_situacao';
    }
  }

  resetSolicitacaoBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    this.Contexto = event.data;
  }

  onRowExpand(evento) {
    if (this.tabela.titulos.length === 0) {
      this.tabela.titulos = this.ts.buscaTitulos(this.tabela.campos);
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    let ev = evento.data;
    this.has.histFormI = {
      hist: {
        historico_processo_id: +evento.data.processo_id,
        historico_solicitacao_id: +evento.data.solicitacao_id
      }
    };
    this.tabela.titulos.forEach(t => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].length > 0) {
          let celula: CelulaI = {
            header: t.titulo,
            field: t.field,
            valor: ev[t.field],
            txtVF: false,
            cphtml: ev[t.field]
          }
          const m = this.tabela.camposTexto.findIndex(c => t.field === c);
          if (m > -1 && ev[t.field].length > 40) {
            const d = t.field + '_delta';
            const tx = t.field + '_texto';
            celula.txtVF = true;
            if (ev[d] !== undefined && ev[d] !== null) {
              celula.cpdelta = ev[d];
            }
            if (ev[tx] !== undefined && ev[tx] !== null) {
              celula.cptexto = ev[tx];
              celula.valor = ev[tx];
            }
          }
          if (m > -1 && ev[t.field].length <= 40) {
            celula.valor = limpaTexto(ev[t.field]);
          }
          cl.push(celula);
        }
      }
    });
    this.tabela.celulas = cl;
    this.expandidoSN = true;
  }

  onRowCollapse(ev) {
    delete this.has.histFormI;
    delete this.has.histListI;
    this.tabela.celulas = [];
    this.expandidoSN = false;
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('solic-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('solic-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('solic-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  /*parseTabela(t: any) {
    sessionStorage.removeItem('solic-tabela');
    this.tabela.rows = parseInt(t.rows, 10);
    this.tabela.first = parseInt(t.first, 10);
    this.tabela.sortOrder = parseInt(t.sortOrder, 10);
    this.tabela.sortField = t.sortField;
    this.tabela.todos = (t.todos.toString() === 'true');
    this.tabela.campos = t.campos;
    this.tabela.ids = (t.ids !== undefined) ? t.ids : undefined;
    this.tabela.totalRecords = parseInt(t.totalRecords, 10);
    this.tabela.currentPage = parseInt(t.currentPage, 10);
    this.tabela.pageCount = parseInt(t.pageCount, 10);
    this.tabela.titulos = t.titulos;
    this.tabela.camposTexto = t.camposTexto;
    this.tabela.total = t.total;
    if (t.celulas !== undefined) {
      this.tabela.celulas = t.celulas;
    }
    if (t.todos === 'true' || t.todos === true) {
      this.busca.todos = true;
      this.tabela.todos = true;
    } else {
      this.busca.todos = false;
      this.tabela.todos = false;
    }
  }*/

  /*parseSession(js: any) {
    Object.keys(js).forEach((k) => {
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
  }*/

  parseBusca(b: SolicBuscaI) {
    sessionStorage.removeItem('solic-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.solicitacao_situacao = (b.solicitacao_situacao !== undefined) ? b.solicitacao_situacao : undefined;
    this.busca.solicitacao_cadastro_tipo_id = (b.solicitacao_cadastro_tipo_id !== undefined) ? +b.solicitacao_cadastro_tipo_id : undefined;
    this.busca.solicitacao_cadastro_id = (b.solicitacao_cadastro_id !== undefined) ? +b.solicitacao_cadastro_id : undefined;
    this.busca.solicitacao_assunto_id = (b.solicitacao_assunto_id !== undefined) ? +b.solicitacao_assunto_id : undefined;
    this.busca.solicitacao_atendente_cadastro_id = (b.solicitacao_atendente_cadastro_id !== undefined) ? +b.solicitacao_atendente_cadastro_id : undefined;
    this.busca.solicitacao_cadastrante_cadastro_id = (b.solicitacao_cadastrante_cadastro_id !== undefined) ? +b.solicitacao_cadastrante_cadastro_id : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined) ? +b.cadastro_municipio_id : undefined;
    this.busca.cadastro_regiao_id = (b.cadastro_regiao_id !== undefined) ? +b.cadastro_regiao_id : undefined;
    this.busca.solicitacao_local_id = (b.solicitacao_local_id !== undefined) ? +b.solicitacao_local_id : undefined;
    this.busca.cadastro_bairro = (b.cadastro_bairro !== undefined) ? b.cadastro_bairro : undefined;
    this.busca.solicitacao_tipo_recebimento_id = (b.solicitacao_tipo_recebimento_id !== undefined) ? +b.solicitacao_tipo_recebimento_id : undefined;
    this.busca.solicitacao_area_interesse_id = (b.solicitacao_area_interesse_id !== undefined) ? +b.solicitacao_area_interesse_id : undefined;
    this.busca.solicitacao_reponsavel_analize_id = (b.solicitacao_reponsavel_analize_id !== undefined) ? +b.solicitacao_reponsavel_analize_id : undefined;
    this.busca.solicitacao_data = (b.solicitacao_data !== undefined) ? b.solicitacao_data : undefined;
    this.busca.solicitacao_descricao = (b.solicitacao_descricao !== undefined) ? b.solicitacao_descricao : undefined;
    this.busca.solicitacao_orgao = (b.solicitacao_orgao !== undefined) ? b.solicitacao_orgao : undefined;
    this.busca.processo_numero = (b.processo_numero !== undefined) ? b.processo_numero : undefined;
    this.solicitacaoBusca();
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.ts.buscaTitulos(cps);
  }

  /*buscaTitulosRelatorio(cps: string[]): string[] {
    return this.ts.buscaTitulosRelatorio(cps);
  }*/

  /*excelCamposTexto(): ColunasI[]  {
    let cps: ColunasI[] = [];
    this.tabela.selectedColumns.forEach( c => {
      if (solicSolicitacaoCamposTexto.indexOf(c.field) === -1) {
        cps.push(c);
      }
    });
    return cps;
  }*/

  /*tamanhoLinha(): number {
    let n: number = 0;
    this.tabela.selectedColumns.forEach(t => {
      n += +t.width.replace('px', '');
    });
    return n;
  }*/

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'SOLICITAÇÕES');
    }

    if (n === 2 && this.solicitacoes.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.solicitacoes, 'SOLICITAÇÕES');
    }

    if (n === 3) {
      let busca: SolicBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let solicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            solicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, solicRelatorio.solicitacao, 'SOLICITAÇÕES');
          }
        })
      );
    }


  }

  tabelaPdf(n: number): void  {
    // 1 - selecionados
    // 2 - pagina
    if (n === 1) {
      TabelaPdfService.tabelaPdf(
        'solicitacoes',
        'SOLICITAÇÕES',
        this.tabela.selectedColumns,
        this.selecionados,
        solicSolicitacaoCamposTexto
      );
    }
    if (n === 2) {
      TabelaPdfService.tabelaPdf(
        'solicitacoes',
        'SOLICITAÇÕES',
        this.tabela.selectedColumns,
        this.solicitacoes,
        solicSolicitacaoCamposTexto
      );
    }
    if (n === 3) {
      let busca: SolicBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns,
      busca.todos = true;
      busca.first = undefined;
      let solicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            solicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            TabelaPdfService.tabelaPdf(
              'solicitacoes',
              'SOLICITAÇÕES',
              this.tabela.selectedColumns,
              solicRelatorio.solicitacao,
              solicSolicitacaoCamposTexto
            );
          }
        })
      );

    }
  }

  exportToXLSX(td: number = 1) {
    // const cp = this.ss.excelCamposTexto();
    if (td === 3) {
      let busca: SolicBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let solicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            solicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            ExcelService.criaExcelFile('solicitacao', limpaCampoTexto(solicSolicitacaoCamposTexto, solicRelatorio.solicitacao), this.tabela.selectedColumns);
          }
        })
      );
    }
    if (this.solicitacoes.length > 0 && td === 2) {
      ExcelService.criaExcelFile('solicitacao', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.solicitacoes), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('solicitacao', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td: boolean = true) {
    if (td === true) {
      let busca: SolicBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = td;
      busca.first = undefined;
      let slolicRelatorio: SolicPaginacaoInterface;
      this.sub.push(this.postSolicitacaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            slolicRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            CsvService.jsonToCsv('solicitacao', this.tabela.selectedColumns, slolicRelatorio.solicitacao);

          }
        })
      );
    }
  }

  customSort(ev) {
  }

  solicitacaoBusca(): void {
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.solicitacoes;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.solicitacoes = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.solicitacoes = tmp;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.solicitacoes = tmp;
            this.tabela.sortOrder = 1;
          }
        }
      }
    } else {
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      this.busca.rows = this.tabela.rows;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postSolicitacaoBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.solicitacoes = dados.solicitacao;
            this.tabela.total = dados.total;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.lazy = false;
            if (+this.tabela.totalRecords !== +this.tabela.total.num) {
              this.tabela.totalRecords = +this.tabela.total.num;
            }
            const n = (this.tabela.first + this.tabela.rows) / this.tabela.rows;
            if (+this.tabela.currentPage !== n) {
              this.tabela.currentPage = n;
            }
            const m = Math.ceil(this.tabela.totalRecords / this.tabela.rows);
            if (+this.tabela.pageCount !== m) {
              this.tabela.pageCount = m
            }
            this.stateSN = false;
          }
        })
      );
    }
  }

  postSolicitacaoBusca(busca: SolicBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.solic + '/listar';
    return this.http.post<SolicPaginacaoInterface>(url, busca, httpOptions);
  }

  postSolicitacaoRelatorio(busca: SolicBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.solic + '/relatorio';
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

  getTodosTitulos() {
    this.ts.getTodos();
  }

  getTudo(): any {
    return this.ts.getTudo();
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
    this.has.histFormI = undefined;
    this.has.hist = undefined;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }
}
