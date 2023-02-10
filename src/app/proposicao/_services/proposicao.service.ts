import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from '../../_services';
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TituloI} from "../../_models/titulo-i";
import {TitulosService} from "../../_services/titulos.service";
import {CelulaService} from "../../_services/celula.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {take} from "rxjs/operators";

import {proposicaocampostexto, ProposicaoListarI, ProposicaoPaginacaoI} from "../_models/proposicao-listar-i";
import {ProposicaoBuscaI} from "../_models/proposicao-busca-i";
import {AndamentoProposicaoService} from "./andamento-proposicao.service";
import {ProposicaoI} from "../_models/proposicao-i";
import {AndamentoProposicaoI, AndPropI} from "../_models/andamento-proposicao-i";
import {PropFormI} from "../_models/prop-form-i";


@Injectable({
  providedIn: 'root'
})
export class ProposicaoService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  proposicaoUrl = this.url.proposicao;
  sub: Subscription[] = [];
  proposicoes: ProposicaoListarI[] = [];
  selecionados: ProposicaoListarI[] = [];
  Contexto: ProposicaoListarI;
  busca?: ProposicaoBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: ProposicaoListarI;
  expandidoSN = false;
  proposicaoApagar: ProposicaoListarI | null = null;
  sortField = 'proposicao_situacao';
  sortOrder = 1;
  lazy = false;
  acao: string | null = null;
  colunas: string[] =[];
  mostraSoma = false;
  mostraBtnSoma = false;
  cp0 = false;
  cp1 = false;
  cp2 = false;
  // totais: ProposicaoListarI[] = [];
  titulos: TituloI[] | null = null;
  mudaRows = 50;
  rowsPerPageOptions = [50];


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private aps: AndamentoProposicaoService,
    private celulaService: CelulaService
  ) {
    this.proposicaoUrl = this.url.proposicao;
    this.celulaService.modulo = 'Proposicao'
  }

  buscaMenu() {
    this.proposicaoBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'proposicao_data_apresentacao';
        this.tabela.camposTexto = proposicaocampostexto;
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

  novaBusca(busca: ProposicaoBuscaI) {
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
      this.busca.sortField = 'proposicao_data_apresentacao';
    }
  }

  resetProposicaoBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    this.Contexto = event.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.ts.buscaTitulos('proposicao', cps);
  }

  onRowExpand(evento) {
    console.log('onRowExpand', evento);
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.ts.mTitulo['proposicao'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    const ev = evento.data;
    this.aps.proposicao_id = +evento.data.proposicao_id;
    this.aps.apListar = evento.data.andamento_proposicao;
    this.aps.andPropForm = {
      registro_id: +evento.data.proposicao_id,
      andamentoProposicaoListar: evento.data.andamento_proposicao,
      andamentoProposicaoForm: {
        andamento_proposicao_proposicao_id: +evento.data.proposicao_id
      }
    };
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
    this.aps.andPropForm = null;
    this.aps.andPropList = null;
    this.tabela.celulas = [];
    this.expandidoSN = false;
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('proposicao-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('proposicao-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('proposicao-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: ProposicaoBuscaI) {
    sessionStorage.removeItem('proposicao-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.proposicao_tipo_id = (b.proposicao_tipo_id !== undefined) ? b.proposicao_tipo_id : undefined;
    this.busca.proposicao_id = (b.proposicao_id !== undefined) ? +b.proposicao_id : undefined;
    this.busca.proposicao_autor = (b.proposicao_autor !== undefined) ? b.proposicao_autor : undefined;
    this.busca.proposicao_relator = (b.proposicao_relator !== undefined) ? b.proposicao_relator : undefined;
    this.busca.proposicao_area_interesse_id = (b.proposicao_area_interesse_id !== undefined) ? +b.proposicao_area_interesse_id : undefined;
    this.busca.proposicao_parecer = (b.proposicao_parecer !== undefined) ? b.proposicao_parecer : undefined;
    this.busca.proposicao_origem_id = (b.proposicao_origem_id !== undefined) ? +b.proposicao_origem_id : undefined;
    this.busca.proposicao_emenda_tipo_id = (b.proposicao_emenda_tipo_id !== undefined) ? +b.proposicao_emenda_tipo_id : undefined;
    this.busca.proposicao_situacao_id = (b.proposicao_situacao_id !== undefined) ? +b.proposicao_situacao_id : undefined;
    this.busca.proposicao_relator_atual = (b.proposicao_relator_atual !== undefined) ? b.proposicao_relator_atual : undefined;
    this.busca.proposicao_orgao_id = (b.proposicao_orgao_id !== undefined) ? +b.proposicao_orgao_id : undefined;
    this.busca.proposicao_data1 = (b.proposicao_data1 !== undefined) ? b.proposicao_data1 : undefined;
    this.busca.proposicao_data2 = (b.proposicao_data2 !== undefined) ? b.proposicao_data2 : undefined;
    this.busca.proposicao_ementa = (b.proposicao_ementa !== undefined) ? b.proposicao_ementa : undefined;
    this.busca.proposicao_texto = (b.proposicao_texto !== undefined) ? b.proposicao_texto : undefined;
    this.proposicaoBusca();
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'PROPOSIÇÃO');
    }

    if (n === 2 && this.proposicoes.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.proposicoes, 'PROPOSIÇÃO');
    }

    if (n === 3) {
      const busca: ProposicaoBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let proposicaoRelatorio: ProposicaoPaginacaoI;
      this.sub.push(this.postProposicaoRelatorio(busca)
        .subscribe({
          next: (dados) => {
            proposicaoRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, proposicaoRelatorio.proposicoes, 'PROPOSIÇÃO');
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
          'proposicoes',
          'PROPOSIÇÃO',
          this.tabela.selectedColumns,
          this.selecionados,
          proposicaocampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'proposicoes',
          'PROPOSIÇÃO',
          this.tabela.selectedColumns,
          this.proposicoes,
          proposicaocampostexto
        );
      }
      if (n === 3) {
        const busca: ProposicaoBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns, busca.todos = true;
        busca.first = undefined;
        let proposicaoRelatorio: ProposicaoPaginacaoI;
        this.sub.push(this.postProposicaoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proposicaoRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'proposicoes',
                'PROPOSIÇÃO',
                this.tabela.selectedColumns,
                proposicaoRelatorio.proposicoes,
                proposicaocampostexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td = 1) {

    if (td === 3) {
      if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
        const busca: ProposicaoBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let proposicaoRelatorio: ProposicaoPaginacaoI;
        this.sub.push(this.postProposicaoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              proposicaoRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              ExcelService.criaExcelFile('proposicao', limpaCampoTexto(proposicaocampostexto, proposicaoRelatorio.proposicoes), this.tabela.selectedColumns);
            }
          })
        );
      }
    }
    if (this.proposicoes.length > 0 && td === 2) {
      ExcelService.criaExcelFile('proposicao', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.proposicoes), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('proposicao', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        const busca: ProposicaoBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let slolicRelatorio: ProposicaoPaginacaoI;
        this.sub.push(this.postProposicaoRelatorio(busca)
          .subscribe({
            next: (dados) => {
              slolicRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('proposicao', this.tabela.selectedColumns, slolicRelatorio.proposicoes);

            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  proposicaoBusca(): void {
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        const tmp = this.proposicoes;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.proposicoes = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.proposicoes = tmp;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.proposicoes = tmp;
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
      this.sub.push(this.postProposicaoBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.proposicoes = dados.proposicoes;
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

  postProposicaoBusca(busca: ProposicaoBuscaI) {
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    const url = this.url.proposicao + '/listar';
    return this.http.post<ProposicaoPaginacaoI>(url, busca, httpOptions);
  }

  postProposicaoRelatorio(busca: ProposicaoBuscaI) {
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    const url = this.url.proposicao + '/relatorio';
    return this.http.post<ProposicaoPaginacaoI>(url, busca, httpOptions);
  }

  incluirProposicao(dados: PropFormI): Observable<any> {
    let url: string;
    url = this.url.proposicao + '/incluir';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarProposicao(dados: PropFormI): Observable<any> {
    let url: string;
    url = this.url.proposicao + '/alterar';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  atualizarProposicao(dados: ProposicaoI): Observable<any> {
    let url: string;
    url = this.url.proposicao + '/atualizar';
    const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirProposicao(id: number): Observable<any> {
    const url = this.url.proposicao + '/' + id;
    return this.http.delete<any>(url, { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})});
  }

  /*montaHistorico(idx: number) {
    this.aps.idx = idx;
    this.aps.andPropForm.idx = idx;
  }*/

  recebeRegistro(h: AndPropI) {
      if (h.acao === 'incluir') {
        if (Array.isArray(this.proposicoes[h.idx].andamento_proposicao)) {
          this.proposicoes[h.idx].andamento_proposicao.push(h.andamentoProposicaoListar[0]);
        } else {
          this.proposicoes[h.idx].andamento_proposicao = [h.andamentoProposicaoListar[0]];
        }
      }
      if (h.acao === 'alterar') {
        const m: AndamentoProposicaoI[] = this.proposicoes[h.idx].andamento_proposicao;
        const n: number = m.findIndex(s => s.andamento_proposicao_id === h.andamentoProposicaoListar[0].andamento_proposicao_id);
        this.proposicoes[h.idx].andamento_proposicao.splice(n, 1, h.andamentoProposicaoListar[0]);
      }
      if (h.acao === 'apagar') {
        const m: AndamentoProposicaoI[] = this.proposicoes[h.idx].andamento_proposicao;
        const n: number = m.findIndex(s => s.andamento_proposicao_id === h.andamentoProposicaoListar[0].andamento_proposicao_id);
        this.proposicoes[h.idx].andamento_proposicao.splice(n, 1);
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
    sessionStorage.removeItem('proposicao-busca');
    sessionStorage.removeItem('proposicao-tabela');
    sessionStorage.removeItem('proposicao-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.aps.andPropForm = undefined;
    this.aps.andPropList = undefined;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }




}
