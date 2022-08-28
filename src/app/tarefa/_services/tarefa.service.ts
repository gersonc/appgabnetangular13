import { Injectable } from '@angular/core';
import {TituloI} from "../../_models/titulo-i";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TitulosService} from "../../_services/titulos.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {CelulaService} from "../../_services/celula.service";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {TarefaFormService} from "./tarefa-form.service";
import {TarefaBuscaI, tarefacampostexto, TarefaI, TarefaPaginacaoI} from "../_models/tarefa-i";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TarefaFormI} from "../_models/tarefa-form-i";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  tarefaUrl = this.url.tarefa;
  sub: Subscription[] = [];
  tarefas: TarefaI[] = [];
  selecionados: TarefaI[] = [];
  Contexto: TarefaI;
  busca?: TarefaBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: TarefaI;
  expandidoSN = false;
  tarefaApagar: TarefaI | null = null;
  sortField = 'tarefa_data';
  sortOrder = -1;
  lazy = false;
  acao: string | null = null;
  colunas: string[] = [];
  titulos: TituloI[] | null = null;
  showForm = false;
  mudaRows = 50;
  rowsPerPageOptions = [50];
  formatterBRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

  excelColumns = [
    {field: 'tarefa_cedente', header: 'CEDENTE', sortable: 'true', width: '250px'},
    {field: 'tarefa_vencimento3', header: 'DT. VENC.', sortable: 'true', width: '150px'},
    {field: 'tarefa_valor', header: 'VALOR', sortable: 'true', width: '150px'},
    {field: 'tarefa_paga', header: 'PAGO', sortable: 'true', width: '100px'},
    {field: 'tarefa_pagamento3', header: 'DT. PGTO.', sortable: 'true', width: '150px'},
    {field: 'tarefa_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
    {field: 'tarefa_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'},
    {field: 'tarefa_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'}
  ];


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private tts: TitulosService,
    private celulaService: CelulaService,
    private tfs: TarefaFormService
  ) {
    this.tarefaUrl = this.url.tarefa;
    this.celulaService.modulo = 'Tarefa';
  }

  buscaMenu() {
    this.tarefaBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'tarefa_vencimento2';
        this.tabela.camposTexto = tarefacampostexto;
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

  novaBusca(busca: TarefaBuscaI) {
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
      this.busca.sortField = 'tarefa_vencimento2';
    }
  }

  resetTarefaBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    this.idx = +event.index;
    this.Contexto = event.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.tts.buscaTitulos('tarefa', cps);
  }

  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.tts.mTitulo['tarefa'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    let ev = evento.data;
    this.titulos.forEach(t => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].toString().length > 0) {
          let celula: CelulaI = {
            header: t.titulo,
            field: t.field,
            valor: (t.field !== 'tarefa_valor') ? ev[t.field] : this.formatterBRL.format(ev[t.field]),
            txtVF: false,
            cphtml: ev[t.field]
          }
          if (t.field === 'tarefa_observacao' && ev[t.field].length > 40) {
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
          if (t.field === 'tarefa_observacao' && ev[t.field].length <= 40) {
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
    this.tabela.celulas = [];
    this.expandidoSN = false;
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('tarefa-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('tarefa-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('tarefa-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: TarefaBuscaI) {
    sessionStorage.removeItem('tarefa-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.tarefa_id = (b.tarefa_id !== undefined) ? +b.tarefa_id : undefined;
    this.busca.tarefa_vencimento_1data = (b.tarefa_vencimento_1data !== undefined) ? b.tarefa_vencimento_1data : undefined;
    this.busca.tarefa_vencimento_2data = (b.tarefa_vencimento_2data !== undefined) ? b.tarefa_vencimento_2data : undefined;
    this.busca.tarefa_local_id = (b.tarefa_local_id !== undefined) ? +b.tarefa_local_id : undefined;
    this.busca.tarefa_tipo_id = (b.tarefa_tipo_id !== undefined) ? b.tarefa_tipo_id : undefined;
    this.busca.tarefa_paga_id = (b.tarefa_paga_id !== undefined) ? b.tarefa_paga_id : undefined;
    this.busca.tarefa_pagamento_1data = (b.tarefa_pagamento_1data !== undefined) ? b.tarefa_pagamento_1data : undefined;
    this.busca.tarefa_pagamento_2data = (b.tarefa_pagamento_2data !== undefined) ? b.tarefa_pagamento_2data : undefined;
    this.busca.cedente_array = (b.cedente_array !== undefined) ? b.cedente_array : undefined;
    this.tarefaBusca();
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'TAREFAS');
    }

    if (n === 2 && this.tarefas.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.tarefas, 'TAREFAS');
    }

    if (n === 3) {
      let busca: TarefaBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let tarefaRelatorio: TarefaPaginacaoI;
      this.sub.push(this.postTarefaRelatorio(busca)
        .subscribe({
          next: (dados) => {
            tarefaRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, tarefaRelatorio.tarefas, 'TAREFAS');
          }
        })
      );
    }


  }

  tabelaPdf(n: number): void {
    // 1 - selecionados
    // 2 - pagina
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1) {
        TabelaPdfService.tabelaPdf(
          'tarefas',
          'TAREFAS',
          this.tabela.selectedColumns,
          this.selecionados,
          tarefacampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'tarefas',
          'TAREFAS',
          this.tabela.selectedColumns,
          this.tarefas,
          tarefacampostexto
        );
      }
      if (n === 3) {
        let busca: TarefaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns, busca.todos = true;
        busca.first = undefined;
        let tarefaRelatorio: TarefaPaginacaoI;
        this.sub.push(this.postTarefaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              tarefaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'tarefas',
                'TAREFAS',
                this.tabela.selectedColumns,
                tarefaRelatorio.tarefas,
                tarefacampostexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td: number = 1) {
    if (td === 3) {
      let busca: TarefaBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.excelColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let tarefaRelatorio: TarefaPaginacaoI;
      this.sub.push(this.postTarefaRelatorio(busca)
        .subscribe({
          next: (dados) => {
            tarefaRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            ExcelService.criaExcelFile('tarefa', limpaCampoTexto(tarefacampostexto, tarefaRelatorio.tarefas), this.excelColumns);
          }
        })
      );
      //}
    }
    if (this.tarefas.length > 0 && td === 2) {
      ExcelService.criaExcelFile('tarefa', limpaTabelaCampoTexto(this.excelColumns, this.tabela.camposTexto, this.tarefas), this.excelColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('tarefa', limpaTabelaCampoTexto(this.excelColumns, this.tabela.camposTexto, this.selecionados), this.excelColumns);
      return true;
    }
  }

  exportToCsvTodos(td: boolean = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        let busca: TarefaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let tarefaRelatorio: TarefaPaginacaoI;
        this.sub.push(this.postTarefaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              tarefaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('tarefa', this.tabela.selectedColumns, tarefaRelatorio.tarefas);

            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  tarefaBusca(): void {

    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_vencimento') ? 'tarefa_vencimento3' : (this.tabela.sortField === 'tarefa_pagamento') ? 'tarefa_pagamento3' : this.tabela.sortField;
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.tarefas;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.tarefas = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.tarefas = tmp;
          }
        }
        if (+this.busca.sortOrder === +this.tabela.sortOrder && this.busca.sortField !== this.tabela.sortField) {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.tarefas = tmp;
            this.tabela.sortOrder = 1;
          }
        }
      }
    } else {
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_vencimento') ? 'tarefa_vencimento2' : this.tabela.sortField;
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_pagamento') ? 'tarefa_pagamento2' : this.tabela.sortField;
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postTarefaBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.tarefas = dados.tarefas.map((t) => {
              let p: TarefaI = t;
              p.tarefa_vencimento3 = new Date(t.tarefa_vencimento2);
              if (t.tarefa_pagamento2 !== undefined && t.tarefa_pagamento2 !== null) {
                p.tarefa_pagamento3 = new Date(t.tarefa_pagamento2);
              } else {
                p.tarefa_pagamento3 = null;
              }

              return p;
            });
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

  postTarefaBusca(dados: TarefaBuscaI): Observable<TarefaPaginacaoI> {
    const url = this.url.tarefa + '/listar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<TarefaPaginacaoI>(url, dados, httpOptions);
  }

  postTarefaRelatorio(dados: TarefaBuscaI): Observable<TarefaPaginacaoI> {
    const url = this.url.tarefa + '/relatorio';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<TarefaPaginacaoI>(url, dados, httpOptions);
  }

  incluirTarefa(dados: TarefaFormI): Observable<any[]> {
    const url = this.url.tarefa;
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarTarefa(dados: TarefaFormI): Observable<any[]> {
    const url = this.url.tarefa;
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putTarefaAlterarDatatable(
    tarefa_id: number,
    tarefa_valor: number,
    tarefa_paga_id: number | boolean,
    tarefa_pagamento: string): Observable<any[]> {

    const dados = {
      'tarefa_id': tarefa_id,
      'tarefa_valor': tarefa_valor,
      'tarefa_paga': tarefa_paga_id,
      'tarefa_pagamento': tarefa_pagamento
    };
    const url = this.url.tarefa + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirTarefa(tarefa_id: number, todos: boolean): Observable<any[]> {
    const td: string = todos ? '/t' : '/';
    const url = this.url.tarefa + td + tarefa_id;
    return this.http.delete<any[]>(url);
  }


  rowsChange(ev) {
    this.mudaRows = this.tabela.rows;
  }

  mudaRowsPerPageOptions(t: number) {
    let anterior = 50;
    let teste = [50];
    while (anterior < t) {
      anterior = anterior * 2;
      teste.push(anterior);
    }
    this.rowsPerPageOptions = teste;
  }

  filtraTarefa(d: TarefaFormI): TarefaFormI {
    const and = d;
    for (const key in and) {
      if (d[key] === false) {
        and[key] = 0;
        continue;
      }
      if (d[key] === true) {
        and[key] = 1;
        continue;
      }
      if (Array.isArray(d[key])) {
        if (d[key].lenght > 0) {
          and[key] = d[key];
          continue;
        } else {
          delete d[key];
          delete and[key];
          continue;
        }
      }
      and[key] = d[key];
    }
    return and;
  }

  onDestroy(): void {
    sessionStorage.removeItem('tarefa-busca');
    sessionStorage.removeItem('tarefa-tabela');
    sessionStorage.removeItem('tarefa-table');
    this.tfs.tarefa = null;
    this.tfs.tarefaOld = null;
    this.tfs.tarefaListar = null;
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }
}