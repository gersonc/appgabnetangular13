import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TitulosService} from "../../_services/titulos.service";
import {HistAuxService} from "../../hist/_services/hist-aux.service";
import {CelulaService} from "../../_services/celula.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {take} from "rxjs/operators";
import {EmendaBuscaI} from "../_models/emenda-busca-i";
import {EmendaListarI, EmendaPaginacaoInterface, emendascampostexto} from "../_models/emenda-listar-i";
import {EmendaFormI} from "../_models/emenda-form-i";
import {HistFormI, HistI} from "../../hist/_models/hist-i";
import {SolicFormAnalisar} from "../../solic/_models/solic-form-analisar-i";
import {EmendaAtualizar} from "../_models/emenda-atualizar-i";


@Injectable({
  providedIn: 'root'
})
export class EmendaService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  emendaUrl = this.url.emenda;
  sub: Subscription[] = [];
  emendas: EmendaListarI[] = [];
  selecionados: EmendaListarI[] = [];
  Contexto: EmendaListarI;
  busca?: EmendaBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: EmendaListarI;
  expandidoSN = false;
  emendaApagar: EmendaListarI | null = null;
  // emendaAnalisar: EmendaListarI | null = null;
  sortField = 'emenda_situacao';
  sortOrder = 1;
  lazy = false;
  acao: string | null = null;
  colunas: string[] =[];
  mostraSoma = false;
  mostraBtnSoma = false;
  cp0 = false;
  cp1 = false;
  cp2 = false;
  totais: EmendaListarI[] = [];


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private has: HistAuxService,
    private celulaService: CelulaService
  ) {
    this.emendaUrl = this.url.emenda;
    this.celulaService.modulo = 'Emenda'
  }

  buscaMenu() {
    this.emendaBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'emenda_situacao_nome';
        this.tabela.camposTexto = emendascampostexto;
        this.tabela.camposCurrency = [
          'emenda_valor_solicitado',
          'emenda_valor_empenhado',
          'emenda_valor_pago'
        ];
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

  novaBusca(busca: EmendaBuscaI) {
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
      this.busca.sortField = 'emenda_situacao_nome';
    }
  }

  resetEmendaBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
    this.calcular();
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
        historico_emenda_id: +evento.data.emenda_id
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
      if (sessionStorage.getItem('emenda-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('emenda-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('emenda-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: EmendaBuscaI) {
    sessionStorage.removeItem('emenda-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.emenda_situacao = (b.emenda_situacao !== undefined) ? b.emenda_situacao : undefined;
    this.busca.emenda_id = (b.emenda_id !== undefined) ? +b.emenda_id : undefined;
    this.busca.emenda_id2 = (b.emenda_id2 !== undefined) ? +b.emenda_id2 : undefined;
    this.busca.emenda_cadastro_tipo_id = (b.emenda_cadastro_tipo_id !== undefined) ? +b.emenda_cadastro_tipo_id : undefined;
    this.busca.emenda_cadastro_id = (b.emenda_cadastro_id !== undefined) ? +b.emenda_cadastro_id : undefined;
    this.busca.emenda_assunto_id = (b.emenda_assunto_id !== undefined) ? +b.emenda_assunto_id : undefined;
    this.busca.emenda_tipo_emenda_id = (b.emenda_tipo_emenda_id !== undefined) ? +b.emenda_tipo_emenda_id : undefined;
    this.busca.emenda_cadastro_id2 = (b.emenda_cadastro_id2 !== undefined) ? +b.emenda_cadastro_id2 : undefined;
    this.busca.cadastro_municipio_id = (b.cadastro_municipio_id !== undefined) ? +b.cadastro_municipio_id : undefined;
    this.busca.emenda_ogu_id = (b.emenda_ogu_id !== undefined) ? +b.emenda_ogu_id : undefined;
    this.busca.emenda_local_id = (b.emenda_local_id !== undefined) ? +b.emenda_local_id : undefined;
    this.busca.emenda_autor_nome = (b.emenda_autor_nome !== undefined) ? b.emenda_autor_nome : undefined;
    this.busca.emenda_orgao_solicitado_nome = (b.emenda_orgao_solicitado_nome !== undefined) ? b.emenda_orgao_solicitado_nome : undefined;
    this.busca.emenda_numero = (b.emenda_numero !== undefined) ? b.emenda_numero : undefined;
    this.busca.emenda_crnr = (b.emenda_crnr !== undefined) ? b.emenda_crnr : undefined;
    this.busca.emenda_data_solicitacao1 = (b.emenda_data_solicitacao1 !== undefined) ? b.emenda_data_solicitacao1 : undefined;
    this.busca.emenda_data_solicitacao2 = (b.emenda_data_solicitacao2 !== undefined) ? b.emenda_data_solicitacao2 : undefined;
    this.busca.emenda_data_empenho1 = (b.emenda_data_empenho1 !== undefined) ? b.emenda_data_empenho1 : undefined;
    this.busca.emenda_data_empenho2 = (b.emenda_data_empenho2 !== undefined) ? b.emenda_data_empenho2 : undefined;
    this.busca.emenda_data_pagamento1 = (b.emenda_data_pagamento1 !== undefined) ? b.emenda_data_pagamento1 : undefined;
    this.busca.emenda_data_pagamento2 = (b.emenda_data_pagamento2 !== undefined) ? b.emenda_data_pagamento2 : undefined;
    this.busca.emenda_gmdna = (b.emenda_gmdna !== undefined) ? b.emenda_gmdna : undefined;
    this.busca.emenda_numero_protocolo = (b.emenda_numero_protocolo !== undefined) ? b.emenda_numero_protocolo : undefined;
    this.busca.emenda_uggestao = (b.emenda_uggestao !== undefined) ? b.emenda_uggestao : undefined;
    this.busca.emenda_funcional_programatica = (b.emenda_funcional_programatica !== undefined) ? b.emenda_funcional_programatica : undefined;
    this.busca.emenda_regiao = (b.emenda_regiao !== undefined) ? b.emenda_regiao : undefined;
    this.busca.emenda_numero_empenho = (b.emenda_numero_empenho !== undefined) ? b.emenda_numero_empenho : undefined;this.busca.emenda_processo = (b.emenda_processo !== undefined) ? b.emenda_processo : undefined;
    this.busca.emenda_contrato = (b.emenda_contrato !== undefined) ? b.emenda_contrato : undefined;
    this.busca.emenda_numero_ordem_bancaria = (b.emenda_numero_ordem_bancaria !== undefined) ? b.emenda_numero_ordem_bancaria : undefined;
    this.emendaBusca();
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.ts.buscaTitulos(cps);
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'EMENDAS');
    }

    if (n === 2 && this.emendas.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.emendas, 'EMENDAS');
    }

    if (n === 3) {
      let busca: EmendaBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let emendaRelatorio: EmendaPaginacaoInterface;
      this.sub.push(this.postEmendaRelatorio(busca)
        .subscribe({
          next: (dados) => {
            emendaRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, emendaRelatorio.emendas, 'EMENDAS');
          }
        })
      );
    }


  }

  tabelaPdf(n: number): void  {
    // 1 - selecionados
    // 2 - pagina
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1) {
        TabelaPdfService.tabelaPdf(
          'emendas',
          'EMENDAS',
          this.tabela.selectedColumns,
          this.selecionados,
          emendascampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'emendas',
          'EMENDAS',
          this.tabela.selectedColumns,
          this.emendas,
          emendascampostexto
        );
      }
      if (n === 3) {
        let busca: EmendaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns,
          busca.todos = true;
        busca.first = undefined;
        let emendaRelatorio: EmendaPaginacaoInterface;
        this.sub.push(this.postEmendaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              emendaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'emendas',
                'EMENDAS',
                this.tabela.selectedColumns,
                emendaRelatorio.emendas,
                emendascampostexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td: number = 1) {

    if (td === 3) {
      if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
        let busca: EmendaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let emendaRelatorio: EmendaPaginacaoInterface;
        this.sub.push(this.postEmendaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              emendaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              ExcelService.criaExcelFile('emenda', limpaCampoTexto(emendascampostexto, emendaRelatorio.emendas), this.tabela.selectedColumns);
            }
          })
        );
      }
    }
    if (this.emendas.length > 0 && td === 2) {
      ExcelService.criaExcelFile('emenda', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.emendas), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('emenda', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td: boolean = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        let busca: EmendaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let slolicRelatorio: EmendaPaginacaoInterface;
        this.sub.push(this.postEmendaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              slolicRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('emenda', this.tabela.selectedColumns, slolicRelatorio.emendas);

            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  emendaBusca(): void {
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.emendas;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.emendas = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.emendas = tmp;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.emendas = tmp;
            this.tabela.sortOrder = 1;
          }
        }
      }
      this.calcular();
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
      this.sub.push(this.postEmendaBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.emendas = dados.emendas;
            this.tabela.total = dados.total;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.lazy = false;
            this.calcular();
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

  postEmendaBusca(busca: EmendaBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.emenda + '/listar';
    return this.http.post<EmendaPaginacaoInterface>(url, busca, httpOptions);
  }

  postEmendaRelatorio(busca: EmendaBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.emenda + '/relatorio';
    return this.http.post<EmendaPaginacaoInterface>(url, busca, httpOptions);
  }

  incluirEmenda(dados: EmendaFormI): Observable<any> {
    let url: string;
    url = this.url.emenda + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarEmenda(dados: EmendaFormI): Observable<any> {
    let url: string;
    url = this.url.emenda + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  atualizarEmenda(dados: EmendaAtualizar): Observable<any> {
    let url: string;
    url = this.url.emenda + '/atualizar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirEmenda(id: number): Observable<any> {
    const url = this.url.emenda + '/' + id;
    return this.http.delete<any>(url);
  }

  montaHistorico(modulo: string, idx: number) {
    this.has.histFormI.modulo = modulo;
    this.has.histFormI.idx = idx;
    this.has.histListI = {
      idx: idx,
      modulo: modulo,
      hist: this.expandido.historico_emenda,
      registro_id: +this.expandido.emenda_id
    }
  }

  recebeRegistro(h: HistFormI) {
    if (h.modulo === 'emenda') {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.emendas[h.idx].historico_emenda)) {
          this.emendas[h.idx].historico_emenda.push(h.hist);
        } else {
          this.emendas[h.idx].historico_emenda = [h.hist];
        }
      }
      if (h.acao === 'alterar') {
        const m: HistI[] = this.emendas[h.idx].historico_emenda;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.emendas[h.idx].historico_emenda.splice(n, 1, h.hist);
      }
      if (h.acao === 'apagar') {
        const m: HistI[] = this.emendas[h.idx].historico_emenda;
        const n: number = m.findIndex(s => s.historico_id === h.hist.historico_id);
        this.emendas[h.idx].historico_emenda.splice(n, 1);
      }
    }
  }

  getTodosTitulos() {
    this.ts.getTodos();
  }

  getTudo(): any {
    return this.ts.getTudo();
  }

  onDestroy(): void {
    sessionStorage.removeItem('emenda-busca');
    sessionStorage.removeItem('emenda-tabela');
    sessionStorage.removeItem('emenda-table');
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


  calcular() {
    this.totais = [];
    let tt: EmendaListarI = {};
    this.colunas.forEach( f => {
      tt[f] = null;
    });
      if (this.selecionados.length > 0) {
        tt.emenda_valor_solicitado = this.selecionados.reduce( (a, b) => a + b.emenda_valor_solicitado, 0);
        tt.emenda_valor_empenhado = this.selecionados.reduce((a, b) => a + b.emenda_valor_empenhado, 0);
        tt.emenda_valor_pago = this.selecionados.reduce((a, b) => a + b.emenda_valor_pago, 0);
      } else {
        if (this.emendas.length > 0) {
          tt.emenda_valor_solicitado = this.emendas.reduce( (a, b) => a + b.emenda_valor_solicitado, 0);
          tt.emenda_valor_empenhado = this.emendas.reduce((a, b) => a + b.emenda_valor_empenhado, 0);
          tt.emenda_valor_pago = this.emendas.reduce((a, b) => a + b.emenda_valor_pago, 0);
          }
      }
    this.totais = [tt];
  }



}
