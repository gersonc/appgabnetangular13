import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {take} from "rxjs/operators";
import {TitulosService} from "../../_services/titulos.service";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from "../../_services";
import {OficioListarI, OficioPaginacaoI, OficoCamposTexto} from "../_models/oficio-listar-i";
import {CelulaI} from "../../_models/celula-i";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {CelulaService} from "../../_services/celula.service";
import {limpaCampoTexto, limpaCampoTextoPlus} from "../../shared/functions/limpa-campo-texto";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {OficioBuscaI} from "../_models/oficio-busca-i";
import {DdOficioProcessoIdI} from "../_models/dd-oficio-processo-id-i";
import {OficioFormularioInterface} from "../_models/oficio-formulario";
import {TituloI} from "../../_models/titulo-i";

@Injectable({
  providedIn: 'root'
})
export class OficioService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  oficioUrl = this.url.oficio;
  sub: Subscription[] = [];
  detalhe: OficioListarI | null = null;
  oficios: OficioListarI[] = [];
  selecionados: OficioListarI[] = [];
  Contexto: OficioListarI;
  busca?: OficioBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: OficioListarI;
  expandidoSN = false;
  oficioApagar: OficioListarI | null = null;
  oficioAnalisar: OficioListarI | null = null;
  sortField = 'oficio_status_nome';
  sortOrder = 1;
  lazy = false;
  titulos: TituloI[] | null = null;
  mudaRows = 50;
  rowsPerPageOptions = [50];


  constructor(
    private url: UrlService,
    private http: HttpClient,
    private ts: TitulosService,
    private celulaService: CelulaService
  ) {
    this.oficioUrl = this.url.oficio;
    this.celulaService.modulo = 'Ofício'
  }

  buscaMenu() {
    this.oficioBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'oficio_status_nome';
        this.tabela.camposTexto = OficoCamposTexto;
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

  novaBusca(busca: OficioBuscaI) {
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
      this.busca.sortField = 'oficio_status_nome';
    }
  }

  resetOficioBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    console.log('onContextMenuSelect', event);
    this.idx = event.index;
    this.Contexto = event.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.ts.buscaTitulos('oficio', cps);
    // this.ts.buscaTitulos(cps);
  }

  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.ts.mTitulo['oficio'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    const ev = evento.data;

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
    this.tabela.celulas = [];
    this.expandidoSN = false;
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('oficio-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('oficio-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('oficio-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: OficioBuscaI) {
    sessionStorage.removeItem('oficio-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.oficio_processo_id = (b.oficio_processo_id !== undefined) ? b.oficio_processo_id : undefined;
    this.busca.oficio_codigo = (b.oficio_codigo !== undefined) ? b.oficio_codigo : undefined;
    this.busca.oficio_numero = (b.oficio_numero !== undefined) ? b.oficio_numero : undefined;
    this.busca.oficio_protocolo_numero = (b.oficio_protocolo_numero !== undefined) ? b.oficio_protocolo_numero : undefined;
    this.busca.oficio_municipio_id = (b.oficio_municipio_id !== undefined) ? b.oficio_municipio_id : undefined;
    this.busca.oficio_tipo_solicitante_id = (b.oficio_tipo_solicitante_id !== undefined) ? b.oficio_tipo_solicitante_id : undefined;
    this.busca.oficio_cadastro_id = (b.oficio_cadastro_id !== undefined) ? b.oficio_cadastro_id : undefined;
    this.busca.oficio_convenio = (b.oficio_convenio !== undefined) ? b.oficio_convenio : undefined;
    this.busca.oficio_assunto_id = (b.oficio_assunto_id !== undefined) ? b.oficio_assunto_id : undefined;
    this.busca.oficio_area_interesse_id = (b.oficio_area_interesse_id !== undefined) ? b.oficio_area_interesse_id : undefined;
    this.busca.solicitacao_reponsavel_analize_id = (b.solicitacao_reponsavel_analize_id !== undefined) ? b.solicitacao_reponsavel_analize_id : undefined;
    this.busca.solicitacao_local_id = (b.solicitacao_local_id !== undefined) ? b.solicitacao_local_id : undefined;
    this.busca.oficio_orgao_solicitado_nome = (b.oficio_orgao_solicitado_nome !== undefined) ? b.oficio_orgao_solicitado_nome : undefined;
    this.busca.oficio_orgao_protocolante_nome = (b.oficio_orgao_protocolante_nome !== undefined) ? b.oficio_orgao_protocolante_nome : undefined;
    this.busca.oficio_status_id = (b.oficio_status_id !== undefined) ? b.oficio_status_id : undefined;
    this.busca.oficio_prioridade_id = (b.oficio_prioridade_id !== undefined) ? b.oficio_prioridade_id : undefined;
    this.busca.oficio_tipo_andamento_id = (b.oficio_tipo_andamento_id !== undefined) ? b.oficio_tipo_andamento_id : undefined;
    this.busca.oficio_data_emissao1 = (b.oficio_data_emissao1 !== undefined) ? b.oficio_data_emissao1 : undefined;
    this.busca.oficio_data_emissao2 = (b.oficio_data_emissao2 !== undefined) ? b.oficio_data_emissao2 : undefined;
    this.busca.oficio_data_empenho1 = (b.oficio_data_empenho1 !== undefined) ? b.oficio_data_empenho1 : undefined;
    this.busca.oficio_data_empenho2 = (b.oficio_data_empenho2 !== undefined) ? b.oficio_data_empenho2 : undefined;
    this.busca.oficio_data_protocolo1 = (b.oficio_data_protocolo1 !== undefined) ? b.oficio_data_protocolo1 : undefined;
    this.busca.oficio_data_protocolo2 = (b.oficio_data_protocolo2 !== undefined) ? b.oficio_data_protocolo2 : undefined;
    this.busca.oficio_data_pagamento1 = (b.oficio_data_pagamento1 !== undefined) ? b.oficio_data_pagamento1 : undefined;
    this.busca.oficio_data_pagamento2 = (b.oficio_data_pagamento2 !== undefined) ? b.oficio_data_pagamento2 : undefined;
    this.busca.oficio_prazo1 = (b.oficio_prazo1 !== undefined) ? b.oficio_prazo1 : undefined;
    this.busca.oficio_prazo2 = (b.oficio_prazo2 !== undefined) ? b.oficio_prazo2 : undefined;
    this.busca.oficio_descricao_acao = (b.oficio_descricao_acao !== undefined) ? b.oficio_descricao_acao : undefined;
    this.oficioBusca();
  }

  imprimirTabela(n: number) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
        PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'OFÍCIOS');
      }

      if (n === 2 && this.oficios.length > 0) {
        PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.oficios, 'OFÍCIOS');
      }

      if (n === 3) {
        const busca: OficioBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let oficioRelatorio: OficioPaginacaoI;
        this.sub.push(this.postOficioRelatorio(busca)
          .subscribe({
            next: (dados) => {
              oficioRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              PrintJSService.imprimirTabela2(this.tabela.selectedColumns, oficioRelatorio.oficios, 'OFÍCIOS');
            }
          })
        );
      }
    }
  }

  tabelaPdf(n: number): void  {
    // 1 - selecionados
    // 2 - pagina
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (n === 1) {
        TabelaPdfService.tabelaPdf(
          'oficios',
          'OFÍCIOS',
          this.tabela.selectedColumns,
          this.selecionados,
          OficoCamposTexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'oficios',
          'OFÍCIOS',
          this.tabela.selectedColumns,
          this.oficios,
          OficoCamposTexto
        );
      }
      if (n === 3) {
        const busca: OficioBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns,
          busca.todos = true;
        busca.first = undefined;
        let oficioRelatorio: OficioPaginacaoI;
        this.sub.push(this.postOficioRelatorio(busca)
          .subscribe({
            next: (dados) => {
              oficioRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'oficios',
                'OFÍCIOS',
                this.tabela.selectedColumns,
                oficioRelatorio.oficios,
                OficoCamposTexto
              );
            }
          })
        );
      }
    }
  }

  exportToXLSX(td = 1) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      // const cp = this.ss.excelCamposTexto();
      if (td === 3) {
        const busca: OficioBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let oficioRelatorio: OficioPaginacaoI;
        this.sub.push(this.postOficioRelatorio(busca)
          .subscribe({
            next: (dados) => {
              oficioRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              ExcelService.criaExcelFile('oficio', limpaCampoTexto(OficoCamposTexto, oficioRelatorio.oficios), this.tabela.selectedColumns);
            }
          })
        );
      }
      if (this.oficios.length > 0 && td === 2) {
        ExcelService.criaExcelFile('oficio', limpaTabelaCampoTexto(this.tabela.selectedColumns, this.tabela.camposTexto, this.oficios), this.tabela.selectedColumns);
        return true;
      }
      if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
        ExcelService.criaExcelFile('oficio', limpaTabelaCampoTexto(this.tabela.selectedColumns, this.tabela.camposTexto, this.selecionados), this.tabela.selectedColumns);
        return true;
      }
    }
  }

  exportToCsvTodos(td = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        const busca: OficioBuscaI = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let oficioRelatorio: OficioPaginacaoI;
        this.sub.push(this.postOficioRelatorio(busca)
          .subscribe({
            next: (dados) => {
              oficioRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('oficio', this.tabela.selectedColumns, limpaCampoTextoPlus(OficoCamposTexto, oficioRelatorio.oficios));
            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  oficioBusca(): void {
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        const tmp = this.oficios;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.oficios = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.oficios = tmp;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.oficios = tmp;
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
      this.sub.push(this.postOficioBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.oficios = dados.oficios;
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

  postOficioBusca(busca: OficioBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.oficio + '/listar';
    return this.http.post<OficioPaginacaoI>(url, busca, httpOptions);
  }

  postOficioRelatorio(busca: OficioBuscaI) {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    const url = this.url.oficio + '/relatorio';
    return this.http.post<OficioPaginacaoI>(url, busca, httpOptions);
  }

  getDdProcessoId(processo_id): Observable<DdOficioProcessoIdI> {
    const url = this.url.oficio + '/ddprocesso/' + processo_id;
    return this.http.get<DdOficioProcessoIdI>(url);
  }

  incluirOficio(dados: OficioFormularioInterface): Observable<any[]> {
    const url = this.url.oficio + '/incluir';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  /*getOficioAlterar(oficio_id: number): Observable<OficioInterface> {
    const url = this.url.oficio + '/alterar/' + oficio_id;
    this.getalterar$ = this.http.get<OficioInterface>(url);
    return this.getalterar$;
  }*/

  alterarOficio(dados: OficioFormularioInterface): Observable<any[]> {
    const url = this.url.oficio + '/alterar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]> (url, dados, httpOptions);
  }

  deleteOficioId(oficio_id: number): Observable<any[]> {
    const url = this.url.oficio + '/' + oficio_id;
    return this.http.delete<any[]>(url);
  }

  putOficioAnalisar(dados: any): Observable<any[]> {
    const url = this.url.oficio + '/analisar';
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
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
    sessionStorage.removeItem('oficio-busca');
    sessionStorage.removeItem('oficio-tabela');
    sessionStorage.removeItem('oficio-table');
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = [];
    this.Contexto = undefined;
    this.stateSN = false;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }
}
