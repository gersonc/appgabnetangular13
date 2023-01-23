import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
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
import {ContaBuscaI, contacampostexto, ContaFormI, ContaI, ContaPaginacaoInterface} from "../_models/conta-i";
import {ContaFormService} from "./conta-form.service";

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  contaUrl = this.url.conta;
  sub: Subscription[] = [];
  contas: ContaI[] = [];
  selecionados: ContaI[] = [];
  Contexto: ContaI;
  busca?: ContaBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: ContaI;
  expandidoSN = false;
  contaApagar: ContaI | null = null;
  sortField = 'conta_data';
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
    {field: 'conta_cedente', header: 'CEDENTE', sortable: 'true', width: '250px'},
    {field: 'conta_vencimento3', header: 'DT. VENC.', sortable: 'true', width: '150px'},
    {field: 'conta_valor', header: 'VALOR', sortable: 'true', width: '150px'},
    {field: 'conta_paga', header: 'PAGO', sortable: 'true', width: '100px'},
    {field: 'conta_pagamento3', header: 'DT. PGTO.', sortable: 'true', width: '150px'},
    {field: 'conta_tipo', header: 'TIPO', sortable: 'true', width: '100px'},
    {field: 'conta_observacao', header: 'OBSERVAÇÃO', sortable: 'false', width: '500px'},
    {field: 'conta_local_nome', header: 'NÚCLEO', sortable: 'true', width: '200px'}
  ];


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private tts: TitulosService,
    private celulaService: CelulaService,
    private cfs: ContaFormService
  ) {
    this.contaUrl = this.url.conta;
    this.celulaService.modulo = 'Conta';
  }

  buscaMenu() {
    this.contaBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'conta_vencimento2';
        this.tabela.camposTexto = contacampostexto;
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

  novaBusca(busca: ContaBuscaI) {
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
      this.busca.sortField = 'conta_vencimento2';
    }
  }

  resetContaBusca() {
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
    this.titulos = this.tts.buscaTitulos('conta', cps);
  }

  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.tts.mTitulo['conta'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    const ev = evento.data;
    this.titulos.forEach(t => {
      if (ev[t.field] !== undefined && ev[t.field] !== null) {
        if (ev[t.field].toString().length > 0) {
          const celula: CelulaI = {
            header: t.titulo,
            field: t.field,
            valor: (t.field !== 'conta_valor') ? ev[t.field] : this.formatterBRL.format(ev[t.field]),
            txtVF: false,
            cphtml: ev[t.field]
          }
          if (t.field === 'conta_observacao' && ev[t.field].length > 40) {
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
          if (t.field === 'conta_observacao' && ev[t.field].length <= 40) {
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
      if (sessionStorage.getItem('conta-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('conta-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('conta-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: ContaBuscaI) {
    sessionStorage.removeItem('conta-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.conta_id = (b.conta_id !== undefined) ? +b.conta_id : undefined;
    this.busca.conta_vencimento_1data = (b.conta_vencimento_1data !== undefined) ? b.conta_vencimento_1data : undefined;
    this.busca.conta_vencimento_2data = (b.conta_vencimento_2data !== undefined) ? b.conta_vencimento_2data : undefined;
    this.busca.conta_local_id = (b.conta_local_id !== undefined) ? +b.conta_local_id : undefined;
    this.busca.conta_tipo_id = (b.conta_tipo_id !== undefined) ? b.conta_tipo_id : undefined;
    this.busca.conta_paga_id = (b.conta_paga_id !== undefined) ? b.conta_paga_id : undefined;
    this.busca.conta_pagamento_1data = (b.conta_pagamento_1data !== undefined) ? b.conta_pagamento_1data : undefined;
    this.busca.conta_pagamento_2data = (b.conta_pagamento_2data !== undefined) ? b.conta_pagamento_2data : undefined;
    this.busca.cedente_array = (b.cedente_array !== undefined) ? b.cedente_array : undefined;
    this.contaBusca();
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'CONTAS');
    }

    if (n === 2 && this.contas.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.contas, 'CONTAS');
    }

    if (n === 3) {
      const busca: ContaBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let contaRelatorio: ContaPaginacaoInterface;
      this.sub.push(this.postContaRelatorio(busca)
        .subscribe({
          next: (dados) => {
            contaRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, contaRelatorio.contas, 'CONTAS');
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
          'contas',
          'CONTAS',
          this.tabela.selectedColumns,
          this.selecionados,
          contacampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'contas',
          'CONTAS',
          this.tabela.selectedColumns,
          this.contas,
          contacampostexto
        );
      }
      if (n === 3) {
        const busca: ContaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns, busca.todos = true;
        busca.first = undefined;
        let contaRelatorio: ContaPaginacaoInterface;
        this.sub.push(this.postContaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              contaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'contas',
                'CONTAS',
                this.tabela.selectedColumns,
                contaRelatorio.contas,
                contacampostexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td = 1) {
    if (td === 3) {
      const busca: ContaBuscaI = this.busca;
      busca.rows = undefined;
      busca.campos = this.excelColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let contaRelatorio: ContaPaginacaoInterface;
      this.sub.push(this.postContaRelatorio(busca)
        .subscribe({
          next: (dados) => {
            contaRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            ExcelService.criaExcelFile('conta', limpaCampoTexto(contacampostexto, contaRelatorio.contas), this.excelColumns);
          }
        })
      );
      //}
    }
    if (this.contas.length > 0 && td === 2) {
      ExcelService.criaExcelFile('conta', limpaTabelaCampoTexto(this.excelColumns, this.tabela.camposTexto, this.contas), this.excelColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('conta', limpaTabelaCampoTexto(this.excelColumns, this.tabela.camposTexto, this.selecionados), this.excelColumns);
      return true;
    }
  }

  exportToCsvTodos(td = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        const busca: ContaBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let contaRelatorio: ContaPaginacaoInterface;
        this.sub.push(this.postContaRelatorio(busca)
          .subscribe({
            next: (dados) => {
              contaRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('conta', this.tabela.selectedColumns, contaRelatorio.contas);

            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  contaBusca(): void {

    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      this.tabela.sortField = (this.tabela.sortField === 'conta_vencimento') ? 'conta_vencimento3' : (this.tabela.sortField === 'conta_pagamento') ? 'conta_pagamento3' : this.tabela.sortField;
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        const tmp = this.contas;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.contas = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.contas = tmp;
          }
        }
        if (+this.busca.sortOrder === +this.tabela.sortOrder && this.busca.sortField !== this.tabela.sortField) {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.contas = tmp;
            this.tabela.sortOrder = 1;
          }
        }
      }
    } else {
      this.tabela.sortField = (this.tabela.sortField === 'conta_vencimento') ? 'conta_vencimento2' : this.tabela.sortField;
      this.tabela.sortField = (this.tabela.sortField === 'conta_pagamento') ? 'conta_pagamento2' : this.tabela.sortField;
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postContaBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.contas = dados.contas.map((t) => {
              const p: ContaI = t;
              p.conta_vencimento3 = new Date(t.conta_vencimento2);
              if (t.conta_pagamento2 !== undefined && t.conta_pagamento2 !== null) {
                p.conta_pagamento3 = new Date(t.conta_pagamento2);
              } else {
                p.conta_pagamento3 = null;
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

  postContaBusca(dados: ContaBuscaI): Observable<ContaPaginacaoInterface> {
    const url = this.url.conta + '/listar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<ContaPaginacaoInterface>(url, dados, httpOptions);
  }

  postContaRelatorio(dados: ContaBuscaI): Observable<ContaPaginacaoInterface> {
    const url = this.url.conta + '/relatorio';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<ContaPaginacaoInterface>(url, dados, httpOptions);
  }

  incluirConta(dados: ContaFormI): Observable<any[]> {
    const url = this.url.conta;
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarConta(dados: ContaFormI): Observable<any[]> {
    const url = this.url.conta;
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  putContaAlterarDatatable(
    conta_id: number,
    conta_valor: number,
    conta_paga_id: number | boolean,
    conta_pagamento: string): Observable<any[]> {

    const dados = {
      'conta_id': conta_id,
      'conta_valor': conta_valor,
      'conta_paga': conta_paga_id,
      'conta_pagamento': conta_pagamento
    };
    const url = this.url.conta + '/alterar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, dados, httpOptions);
  }

  excluirConta(conta_id: number, todos: boolean): Observable<any[]> {
    const td: string = todos ? '/t' : '/';
    const url = this.url.conta + td + conta_id;
    return this.http.delete<any[]>(url);
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

  filtraConta(d: ContaFormI): ContaFormI {
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
    sessionStorage.removeItem('conta-busca');
    sessionStorage.removeItem('conta-tabela');
    sessionStorage.removeItem('conta-table');
    this.cfs.conta = null;
    this.cfs.contaOld = null;
    this.cfs.contaListar = null;
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }
}
