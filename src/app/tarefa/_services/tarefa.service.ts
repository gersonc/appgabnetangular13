import { Injectable } from '@angular/core';
import {ITitulos, TituloI} from "../../_models/titulo-i";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TitulosService} from "../../_services/titulos.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {CelulaService} from "../../_services/celula.service";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {TarefaFormService} from "./tarefa-form.service";
import {
  TarefaAutorSituacaoFormI,
  TarefaBuscaI,
  tarefacampostexto, TarefaFormI,
  TarefaI,
  TarefaPaginacaoI,
  TarefaTitulo,
  TarefaUsuarioSituacaoAtualisarFormI
} from "../_models/tarefa-i";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {take} from "rxjs/operators";
import {ColunasI} from "../../_models/colunas-i";
import {TarefaPrintService} from "./tarefa-print.service";
import {TarefaPdfService} from "./tarefa-pdf.service";

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
  sortField = 'tarefa_data2';
  sortOrder = -1;
  lazy = true;
  acao: string | null = null;
  colunas: string[] = [];
  titulos: TituloI[] | null = null;
  showForm = false;
  acaoForm = 'INCLUIR';
  mudaRows = 50;
  rowsPerPageOptions = [50];
  colsTrocar = ['tarefa_data', 'tarefa_datahora'];
  tTit = new TarefaTitulo();
  showTusForm = false;
  showSitForm = false;
  showExcluir = false;
  // formatterBRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});

  iTitulos: ITitulos[] | null = null;

  colsTarefa: string[] = [
    'tarefa_id',
    'tarefa_titulo',
    'tarefa_tarefa',
    'tarefa_situacao_nome',
    'tarefa_usuario_situacao',
    'tarefa_data',
    'tarefa_usuario_autor_nome',
    'tarefa_datahora',
    'tarefa_usuario_situacao_andamento',
  ];

  colSituacao: string[] = [
    'tu_usuario_nome',
    'tus_situacao_nome',
  ];

  colAndamento: string[] = [
    'tu_usuario_nome',
    'tus_situacao_nome',
    'th_data',
    'th_historico'
  ];

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
    private tfs: TarefaFormService,
    private tps: TarefaPrintService,
    private tpdfs: TarefaPdfService
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
        this.tabela.sortField = 'tarefa_data2';
        this.tabela.sortOrder = -1;
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
    console.log('criaBusca',this.busca);
  }

  novaBusca(busca: TarefaBuscaI) {
    console.log('novaBusca',busca);
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
      if (this.busca.sortField === 'tarefa_data' || this.busca.sortField === 'tarefa_datahora') {
        if (this.busca.sortField === 'tarefa_data') {
          this.busca.sortField = 'tarefa_data2';
        }
        if (this.busca.sortField === 'tarefa_datahora') {
          this.busca.sortField = 'tarefa_datahora2';
        }
        if (this.busca.sortOrder !== undefined) {
          this.busca.sortOrder *= -1;
        }
      }
      if (this.busca.sortField === undefined) {
        this.busca.sortOrder = -1;
        this.busca.sortField = 'tarefa_data2';
      }

    }
    console.log('novaBusca2',this.busca);
  }

  resetTarefaBusca() {
    this.lazy = false;
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
      if (this.tTit.tarefa_tarefa === '') {
        this.getTitulo();
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
            valor: ev[t.field],
            txtVF: false,
            cphtml: ev[t.field]
          }
          if (t.field === 'tarefa_tarefa' && ev[t.field].length > 40) {
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
          if (t.field === 'tarefa_tarefa' && ev[t.field].length <= 40) {
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
    this.busca.tipo_listagem = (b.tipo_listagem !== undefined) ? +b.tipo_listagem : undefined;
    this.busca.tarefa_titulo = (b.tarefa_titulo !== undefined) ? b.tarefa_titulo : undefined;
    this.busca.tarefa_usuario_autor_id = (b.tarefa_usuario_autor_id !== undefined) ? +b.tarefa_usuario_autor_id : undefined;
    this.busca.tarefa_usuario_id = (b.tarefa_usuario_id !== undefined) ? +b.tarefa_usuario_id : undefined;
    this.busca.tarefa_situacao_id = (b.tarefa_situacao_id !== undefined) ? b.tarefa_situacao_id : undefined;
    this.busca.tarefa_datahora1 = (b.tarefa_datahora1 !== undefined) ? b.tarefa_datahora1 : undefined;
    this.busca.tarefa_datahora2 = (b.tarefa_datahora2 !== undefined) ? b.tarefa_datahora2 : undefined;
    this.busca.tarefa_data1 = (b.tarefa_data1 !== undefined) ? b.tarefa_data1 : undefined;
    this.busca.tarefa_data2 = (b.tarefa_data2 !== undefined) ? b.tarefa_data2 : undefined;
    this.busca.tarefa_titulo_array = (b.tarefa_titulo_array !== undefined) ? b.tarefa_titulo_array : undefined;
    this.tarefaBusca();
  }

  onImprimirTarefa(tarefa: TarefaI) {
    this.tps.valores = [tarefa];
    this.tps.PrintElem();
  }

  onGerarPdfTarefa(tarefa: TarefaI) {
    this.tps.valores = [tarefa];
    this.tps.getPdf();
  }

  imprimirTabela(n: number) {
    const campos: string[] = this.tabela.selectedColumns.map(t => {return t.field;});
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      this.tps.campos = this.tabela.selectedColumns;
      this.tps.valores = this.selecionados;
      this.tps.tit = this.getTitulos();
      // this.tps.PrintTarefas();
    }

    if (n === 2 && this.tarefas.length > 0) {
      this.tps.campos = this.tabela.selectedColumns;
      this.tps.valores = this.tarefas;
      this.tps.tit = this.getTitulos();
      // this.tps.imprimir();
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
            this.tps.campos = this.tabela.selectedColumns;
            this.tps.valores = tarefaRelatorio.tarefas;
            this.tps.tit = this.getTitulos();
            // this.tps.PrintTarefas();

            // PrintJSService.imprimirTabela2(this.tabela.selectedColumns, tarefaRelatorio.tarefas, 'TAREFAS');
          }
        })
      );
    }


  }

  imprimirTabela2(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'TAREFAS');
    }

    if (n === 2 && this.tarefas.length > 0) {
      const dados = this.tarefas.map(t => {
        let h: any[] = [];
        if (t.tarefa_historico.length > 0) {
          h = t.tarefa_historico.map(i => {
            const hi = {
              data: i.th_data,
              usuario: i.th_usuario_nome,
              andamento: i.th_historico
            }
            return hi;
          });
        }
        // const h = t.tarefa_historico
        let f: any = {
          tarefa_titulo: t.tarefa_titulo,
          tarefa_tarefa: t.tarefa_tarefa,
          tarefa_situacao_nome: t.tarefa_situacao_nome,
          tarefa_historico: h
        }
        return f;
      });

      const ti: any[] = [
        'tarefa_titulo',
        'tarefa_tarefa',
        'tarefa_situacao_nome',
        ['data','usuario','andamento']
      ]

      // PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.tarefas, 'TAREFAS');
      PrintJSService.imprimirTabela3(dados, ti);
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
    const campos: string[] = this.tabela.selectedColumns.map(t => {return t.field;});


      if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
        this.tpdfs.geraTabelaPdf(this.selecionados, this.tabela.selectedColumns, this.getTitulos());
      }

    if (n === 2 && this.tarefas.length > 0) {
      this.tpdfs.geraTabelaPdf(this.tarefas, this.tabela.selectedColumns, this.getTitulos());
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
            this.tpdfs.geraTabelaPdf(this.tarefas, this.tabela.selectedColumns, this.getTitulos());
          }
        })
      );
    }
  }

  exportToXLSX(td: number = 1) {
    if (td === 3) {
      if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
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
            ExcelService.criaExcelFile('tarefa', limpaCampoTexto(tarefacampostexto, tarefaRelatorio.tarefas), this.excelColumns);
          }
        })
      );
     }
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
    console.log('customSort',ev );
  }

  tarefaBusca(): void {
    if (this.lazy &&
      this.tabela.totalRecords <= +this.tabela.rows &&
      this.busca.ids === this.tabela.ids &&
      this.busca.first === this.tabela.first &&
      +this.tabela.rows === +this.mudaRows) {
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_data') ? 'tarefa_data3' : (this.tabela.sortField === 'tarefa_datahora') ? 'tarefa_datahora3' : this.tabela.sortField;
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.tarefas;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
        // if (+this.busca.sortOrder !== +this.tabela.sortOrder) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.tarefas = tmp;
            this.lazy = true;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.tarefas = tmp;
            this.lazy = true;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
              this.busca.sortField = this.tabela.sortField;
              this.busca.sortOrder = 1;
              tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
              this.tarefas = tmp;
              this.tabela.sortOrder = 1;
              this.lazy = true;
          }
        }
      }
    } else {
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_data') ? 'tarefa_data2' : this.tabela.sortField;
      this.tabela.sortField = (this.tabela.sortField === 'tarefa_datahora') ? 'tarefa_datahora2' : this.tabela.sortField;
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
              p.tarefa_data3 = new Date(t.tarefa_data2);
              p.tarefa_datahora3 = new Date(t.tarefa_datahora2);
              if (t.tarefa_historico !== undefined && t.tarefa_historico !== null && Array.isArray(t.tarefa_historico) && t.tarefa_historico.length > 0) {
                const tt = t.tarefa_historico;
                t.tarefa_historico = tt.map((h ) => {
                  h.th_data3 = new Date(h.th_data2);
                  return h;
                });
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
            this.lazy = this.tabela.totalRecords > this.tabela.rows;
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
    const url = this.url.tarefa + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }

  alterarTarefa(dados: TarefaFormI): Observable<any[]> {
    const url = this.url.tarefa + '/alterar';
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

  excluirTarefa(tarefa_id: number): Observable<any[]> {
    const url = this.url.tarefa + '/' + tarefa_id;
    return this.http.delete<any[]>(url);
  }

  putTarefaAtualizarUsuarioSituacao(tusa: TarefaUsuarioSituacaoAtualisarFormI): Observable<any[]> {
    const url = this.url.tarefa + '/atualizar/usuario/situacao';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, tusa, httpOptions);
  }

  putTarefaAtualizarAutorSituacao(tusa: TarefaAutorSituacaoFormI): Observable<any[]> {
    const url = this.url.tarefa + '/atualizar/autor/situacao';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<any[]>(url, tusa, httpOptions);
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
    if (!this.stateSN) {
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
      this.tarefas = [];
    }

    this.sub.forEach(s => s.unsubscribe());
  }

  getTitulo() {
    const t0 =  this.titulos.find(t => t.field === 'tarefa_titulo');
    this.tTit.tarefa_titulo = t0.titulo;
    const t1 =  this.titulos.find(t => t.field === 'tarefa_tarefa');
    this.tTit.tarefa_tarefa = t1.titulo;
    const t2 =  this.titulos.find(t => t.field === 'tarefa_situacao_nome');
    this.tTit.tarefa_situacao_nome = t2.titulo;
    const t3 =  this.titulos.find(t => t.field === 'tarefa_data');
    this.tTit.tarefa_data = t3.titulo;
    const t4 =  this.titulos.find(t => t.field === 'tarefa_usuario_autor_nome');
    this.tTit.tarefa_usuario_autor_nome = t4.titulo;
    const t5 =  this.titulos.find(t => t.field === 'tarefa_datahora');
    this.tTit.tarefa_datahora = t5.titulo;
    const t6 =  this.titulos.find(t => t.field === 'tarefa_usuario_situacao');
    this.tTit.tarefa_usuario_situacao = t6.titulo;
    const t7 =  this.titulos.find(t => t.field === 'tarefa_usuario_situacao_andamento');
    this.tTit.tarefa_usuario_situacao_andamento = t7.titulo;
  }

  getTitulos(): ITitulos[] {
    if (this.iTitulos === null) {
      this.iTitulos = [];
      this.iTitulos['tarefa'] = this.tts.getITitulos('tarefa', this.colsTarefa);
      return this.iTitulos;
    } else {
      return this.iTitulos;
    }
  }
}
