import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {take} from "rxjs/operators";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {ProceDetalheI, ProceHistoricoI, ProceOficioI} from "../_model/proce-detalhe-i";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TitulosService} from "../../_services/titulos.service";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {HistFormI, HistI} from "../../hist/_models/hist-i";
import {HistAuxService} from "../../hist/_services/hist-aux.service";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {limpaCampoTexto, limpaCampoTextoPlus} from "../../shared/functions/limpa-campo-texto";
import {CelulaI} from "../../_models/celula-i";
import {CelulaService} from "../../_services/celula.service";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {ProceListarI, ProcePaginacaoInterface} from "../_model/proce-listar-i";
import {proceProcessoCamposTexto} from "../_model/proc-i";
import {ProceBuscaI} from "../_model/proce-busca-i";
import {ProcFormAnalisarI} from "../_model/proc-form-analisar-i";
import {TituloI} from "../../_models/titulo-i";

@Injectable({
  providedIn: 'root'
})
export class ProceService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  processoUrl = this.url.proce;
  sub: Subscription[] = [];
  detalhe: ProceListarI | null = null;
  processos: ProceListarI[];
  selecionados: ProceListarI[] = [];
  Contexto: ProceListarI;
  busca?: ProceBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: ProceListarI;
  expandidoSN = false;
  procApagar: ProceListarI | null = null;
  procAnalisar: ProceListarI | null = null;
  sortField = 'solicitacao_situacao';
  sortOrder = 1;
  lazy = false;
  msgCtxH = true;
  titulos: TituloI[] | null = null;
  mudaRows = 50;
  rowsPerPageOptions = [50];

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private has: HistAuxService,
    private celulaService: CelulaService
  ) {
    this.processoUrl = this.url.proce;
    this.celulaService.modulo = 'Processo'
  }

  buscaMenu() {
    this.proceBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'solicitacao_situacao';
        this.tabela.camposTexto = proceProcessoCamposTexto;
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

  novaBusca(busca: ProceBuscaI) {
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

  resetProceBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(evento) {
    this.Contexto = evento.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.ts.buscaTitulos('proce', cps);
    // this.ts.buscaTitulos(cps);
  }

  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.ts.mTitulo['proce'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    const ev = evento.data;
    this.has.histFormI = {
      hist: {
        historico_processo_id: +evento.data.processo_id,
        historico_solicitacao_id: +evento.data.solicitacao_id
      }
    };
    // this.tabela.titulos.forEach(t => {
    this.titulos.forEach(t => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].length > 0) {
          const celula: CelulaI = {
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
      if (sessionStorage.getItem('proce-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('proce-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('proce-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: ProceBuscaI) {
    sessionStorage.removeItem('proce-busca');
    this.busca.solicitacao_situacao = (b.solicitacao_situacao !== undefined) ? b.solicitacao_situacao : undefined;
    this.busca.cadastro_tipo_id = (b.cadastro_tipo_id !== undefined) ? +b.cadastro_tipo_id : undefined;
    this.busca.cadastro_id = (b.cadastro_id !== undefined) ? +b.cadastro_id : undefined;
    this.busca.solicitacao_assunto_id = (b.solicitacao_assunto_id !== undefined) ? +b.solicitacao_assunto_id : undefined;
    this.busca.processo_status_id = (b.processo_status_id !== undefined) ? +b.processo_status_id : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined) ? +b.cadastro_municipio_id : undefined;
    this.busca.cadastro_regiao_id = (b.cadastro_regiao_id !== undefined) ? +b.cadastro_regiao_id : undefined;
    this.busca.solicitacao_local_id = (b.solicitacao_local_id !== undefined) ? +b.solicitacao_local_id : undefined;
    this.busca.solicitacao_area_interesse_id = (b.solicitacao_area_interesse_id !== undefined) ? +b.solicitacao_area_interesse_id : undefined;
    this.busca.solicitacao_reponsavel_analize_id = (b.solicitacao_reponsavel_analize_id !== undefined) ? +b.solicitacao_reponsavel_analize_id : undefined;
    this.busca.solicitacao_data1 = (b.solicitacao_data1 !== undefined) ? b.solicitacao_data1 : undefined;
    this.busca.solicitacao_data2 = (b.solicitacao_data2 !== undefined) ? b.solicitacao_data2 : undefined;
    this.busca.solicitacao_orgao = (b.solicitacao_orgao !== undefined) ? b.solicitacao_orgao : undefined;
    this.busca.processo_numero = (b.processo_numero !== undefined) ? b.processo_numero : undefined;
    this.proceBusca();
  }

  imprimirTabela(n: number) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
        PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'PROCESSOS');
      }

      if (n === 2 && this.processos.length > 0) {
        PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.processos, 'PROCESSOS');
      }

      if (n === 3) {
        const busca: ProceBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let proceRelatorio: ProcePaginacaoInterface;
        this.sub.push(this.postProcessoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proceRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              PrintJSService.imprimirTabela2(this.tabela.selectedColumns, proceRelatorio.processos, 'PROCESSOS');
            }
          })
        );
      }
    }
  }

  tabelaPdf(n: number): void  {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      // 1 - selecionados
      // 2 - pagina
      if (n === 1) {
        TabelaPdfService.tabelaPdf(
          'processos',
          'PROCESSOS',
          this.tabela.selectedColumns,
          this.selecionados,
          proceProcessoCamposTexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'processos',
          'PROCESSOS',
          this.tabela.selectedColumns,
          this.processos,
          proceProcessoCamposTexto
        );
      }
      if (n === 3) {
        const busca: ProceBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns,
          busca.todos = true;
        busca.first = undefined;
        let proceRelatorio: ProcePaginacaoInterface;
        this.sub.push(this.postProcessoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proceRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'processos',
                'PROCESSOS',
                this.tabela.selectedColumns,
                proceRelatorio.processos,
                proceProcessoCamposTexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td = 1) {
    // const cp = this.ss.excelCamposTexto();
    if (td === 3) {
      if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
        const busca: ProceBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let proceRelatorio: ProcePaginacaoInterface;
        this.sub.push(this.postProcessoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proceRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              ExcelService.criaExcelFile('processo', limpaCampoTexto(proceProcessoCamposTexto, proceRelatorio.processos), this.tabela.selectedColumns);
            }
          })
        );
      }
    }
    if (this.processos.length > 0 && td === 2) {
      ExcelService.criaExcelFile('processo', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.processos), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('processo', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        const busca: ProceBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let proceRelatorio: ProcePaginacaoInterface;
        this.sub.push(this.postProcessoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proceRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('processo', this.tabela.selectedColumns, limpaCampoTextoPlus(proceProcessoCamposTexto, proceRelatorio.processos));

            }
          })
        );
      }
    }
  }

  proceBusca(): void {
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        const tmp = this.processos;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.processos = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.processos = tmp;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.processos = tmp;
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
    this.sub.push(this.postProceBusca(this.busca)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.processos = dados.processos;
          this.tabela.total = dados.total;
        },
        error: err => console.error('ERRO-->', err),
        complete: () => {
          this.lazy = false;
          if (+this.tabela.totalRecords !== +this.tabela.total.num) {
            this.tabela.totalRecords = +this.tabela.total.num;
            this.mudaRowsPerPageOptions(this.tabela.totalRecords);
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

  postProceBusca(busca: ProceBuscaI) {
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    const url = this.url.proce + '/listar';
    return this.http.post<ProcePaginacaoInterface>(url, busca, httpOptions);
  }

  postProcessoRelatorio(busca: ProceBuscaI) {
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    const url = this.url.proce + '/relatorio';
    return this.http.post<ProcePaginacaoInterface>(url, busca, httpOptions);
  }

  getProcessoDetalhe(id: number) {
    const url = this.url.proce + '/detalhe/' + id;
    return this.http.get<ProceDetalheI>(url, { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})});
  }

  putProcessoAnalisar(dados: ProcFormAnalisarI): Observable<any> {
    let url: string;
    url = this.url.proce + '/analisar';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirProcesso(id: number): Observable<any> {
    const url = this.url.proce + '/' + id;
    return this.http.delete<any>(url, { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})});
  }

  postVerificarNumOficio(dados: any): Observable<any> {
    let url: string;
    url = this.url.proce + '/verificanumoficio';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  recebeRegistro(h: HistFormI) {
    if (h.modulo === 'solicitacao') {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.processos[h.idx].historico_solicitcao)) {
          this.processos[h.idx].historico_solicitcao.push(h.hist);
        } else {
          this.processos[h.idx].historico_solicitcao = [h.hist];
        }
      }
      if (h.acao === 'alterar') {
        const m: HistI[] = this.processos[h.idx].historico_solicitcao;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.processos[h.idx].historico_solicitcao.splice(n, 1, h.hist);
      }
      if (h.acao === 'apagar') {
        const m: HistI[] = this.processos[h.idx].historico_solicitcao;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.processos[h.idx].historico_solicitcao.splice(n, 1);
      }
    }
    if (h.modulo === 'processo') {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.processos[h.idx].historico_processo)) {
          this.processos[h.idx].historico_processo.push(h.hist);
        } else {
          this.processos[h.idx].historico_processo = [h.hist];
        }
      }
      if (h.acao === 'alterar') {
        const m: HistI[] = this.processos[h.idx].historico_processo;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.processos[h.idx].historico_processo.splice(n, 1, h.hist);
      }
      if (h.acao === 'apagar') {
        this.processos[h.idx].historico_processo.splice(this.processos[h.idx].historico_processo.findIndex(hs => hs.historico_id = h.hist.historico_id), 1);
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

  rowsChange(ev) {
    this.mudaRows = this.tabela.rows;
  }

  mudaRowsPerPageOptions(t: number) {
    let anterior = 50;
    const teste = [50];
    while (anterior < t) {
      anterior = anterior * 2;
      teste.push(anterior);
    }
    this.rowsPerPageOptions = teste;
  }

  onDestroy(): void {
    sessionStorage.removeItem('proce-busca');
    sessionStorage.removeItem('proce-tabela');
    sessionStorage.removeItem('proce-table');
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
