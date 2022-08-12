import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {CsvService, ExcelService, PrintJSService, TabelaPdfService, UrlService} from '../../_services';
import {
  TelefoneBuscaInterface, telefonecampostexto, TelefoneFormI,
  TelefoneFormulario,
  TelefoneInterface,
  TelefonePaginacaoInterface
} from '../_models';
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {TituloI} from "../../_models/titulo-i";
import {TitulosService} from "../../_services/titulos.service";
import {CelulaService} from "../../_services/celula.service";
import {CelulaI} from "../../_models/celula-i";
import {limpaTexto} from "../../shared/functions/limpa-texto";
import {limpaCampoTexto} from "../../shared/functions/limpa-campo-texto";
import {limpaTabelaCampoTexto} from "../../shared/functions/limpa-tabela-campo-texto";
import {take} from "rxjs/operators";
import {TelefoneFormService} from "./telefone-form.service";

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  telefoneUrl = this.url.telefone;
  sub: Subscription[] = [];
  telefones: TelefoneInterface[] =[];
  selecionados: TelefoneInterface[] =[];
  Contexto: TelefoneInterface;
  busca?: TelefoneBuscaInterface;
  tabela?: DatatableI;
  stateSN = false;
  expandido?: TelefoneInterface;
  expandidoSN = false;
  telefoneApagar: TelefoneInterface | null = null;
  sortField = 'telefone_data';
  sortOrder = -1;
  lazy = false;
  acao: string | null = null;
  colunas: string[] =[];
  titulos: TituloI[] | null = null;
  showForm = false;
  mudaRows = 50;
  rowsPerPageOptions = [50];

  // tl: TelefoneInterface | undefined;
  // expandidoDados: any = false;

  // private expandido = new Subject();

  constructor(
    private url: UrlService,
    private http: HttpClient,
    private tts: TitulosService,
    private celulaService: CelulaService,
    private tfs: TelefoneFormService
  ) {
    this.telefoneUrl = this.url.telefone;
    this.celulaService.modulo = 'Telefone';
  }

  buscaMenu() {
    this.telefoneBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'telefone_data2';
        this.tabela.camposTexto = telefonecampostexto;
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

  novaBusca(busca: TelefoneBuscaInterface) {
    console.log('novaBusca1', busca);
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
      this.busca.sortField = 'telefone_data';
    }
    console.log('novaBusca2', this.busca);
  }

  resetTelefoneBusca() {
    this.busca = undefined;
    this.criaBusca();
  }

  resetSelecionados() {
    this.selecionados = [];
  }

  onContextMenuSelect(event) {
    console.log(event);
    this.idx = +event.index;
    this.Contexto = event.data;
  }

  montaTitulos(cps: string[]) {
    this.tabela.campos = [];
    this.tabela.campos = cps;
    this.tabela.titulos = [];
    this.titulos = this.tts.buscaTitulos('telefone', cps);
  }


  onRowExpand(evento) {
    if (this.titulos === undefined || this.titulos === null || (Array.isArray(this.titulos) && this.titulos.length === 0)) {
      this.titulos = this.tts.mTitulo['telefone'];
    }
    this.tabela.dadosExpandidosRaw = evento;
    this.expandido = evento.data;
    const cl: CelulaI[] = [];
    let ev = evento.data;
    this.titulos.forEach(t => {
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
    this.tabela.celulas = [];
    this.expandidoSN = false;
  }

  testaCampoTexto(field: string): boolean {
    return (this.tabela.camposTexto.indexOf(field) > -1);
  }

  onStateRestore(tableSession: any) {
    if (tableSession !== undefined) {
      if (sessionStorage.getItem('telefone-busca')) {
        this.parseBusca(JSON.parse(sessionStorage.getItem('telefone-busca')));
      }
    }
    this.stateSN = false;
  }

  salvaState() {
    this.stateSN = true;
    sessionStorage.setItem('telefone-busca', JSON.stringify(this.busca));
  }

  setState(ev) {
    this.tabela.expandedRowKeys = ev.expandedRowKeys;
  }

  parseBusca(b: TelefoneBuscaInterface) {
    sessionStorage.removeItem('telefone-busca');
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.telefone_assunto1 = (b.telefone_assunto1 !== undefined) ? b.telefone_assunto1 : undefined;
    this.busca.telefone_assunto2 = (b.telefone_assunto2 !== undefined) ? b.telefone_assunto2 : undefined;
    this.busca.telefone_data1 = (b.telefone_data1 !== undefined) ? b.telefone_data1 : undefined;
    this.busca.telefone_data2 = (b.telefone_data2 !== undefined) ? b.telefone_data2 : undefined;
    this.busca.telefone_ddd = (b.telefone_ddd !== undefined) ? b.telefone_ddd : undefined;
    this.busca.telefone_de = (b.telefone_de !== undefined) ? b.telefone_de : undefined;
    this.busca.telefone_id = (b.telefone_id !== undefined) ? +b.telefone_id : undefined;
    this.busca.telefone_local_id = (b.telefone_local_id !== undefined) ? +b.telefone_local_id : undefined;
    this.busca.telefone_para = (b.telefone_para !== undefined) ? b.telefone_para : undefined;
    this.busca.telefone_resolvido_id = (b.telefone_resolvido_id !== undefined) ? +b.telefone_resolvido_id : undefined;
    this.busca.telefone_telefone = (b.telefone_telefone !== undefined) ? b.telefone_telefone : undefined;
    this.busca.telefone_tipo = (b.telefone_tipo !== undefined) ? +b.telefone_tipo : undefined;
    this.busca.telefone_usuario_nome = (b.telefone_usuario_nome !== undefined) ? b.telefone_usuario_nome : undefined;
    this.telefoneBusca();
  }

  imprimirTabela(n: number) {
    if (n === 1 && this.selecionados !== undefined && this.selecionados.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.selecionados, 'TELEFONEMAS');
    }

    if (n === 2 && this.telefones.length > 0) {
      PrintJSService.imprimirTabela2(this.tabela.selectedColumns, this.telefones, 'TELEFONEMAS');
    }

    if (n === 3) {
      let busca: TelefoneBuscaInterface = this.busca;
      busca.rows = undefined;
      busca.campos = this.tabela.selectedColumns;
      busca.todos = true;
      busca.first = undefined;
      busca.excel = true;
      let telefoneRelatorio: TelefonePaginacaoInterface;
      this.sub.push(this.postTelefoneRelatorio(busca)
        .subscribe({
          next: (dados) => {
            telefoneRelatorio = dados
          },
          error: err => {
            console.error('ERRO-->', err);
          },
          complete: () => {
            PrintJSService.imprimirTabela2(this.tabela.selectedColumns, telefoneRelatorio.telefones, 'TELEFONEMAS');
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
          'telefonemas',
          'TELEFONEMAS',
          this.tabela.selectedColumns,
          this.selecionados,
          telefonecampostexto
        );
      }
      if (n === 2) {
        TabelaPdfService.tabelaPdf(
          'telefonemas',
          'TELEFONEMAS',
          this.tabela.selectedColumns,
          this.telefones,
          telefonecampostexto
        );
      }
      if (n === 3) {
        let busca: TelefoneBuscaInterface = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns, busca.todos = true;
        busca.first = undefined;
        let telefoneRelatorio: TelefonePaginacaoInterface;
        this.sub.push(this.postTelefoneRelatorio(busca)
          .subscribe({
            next: (dados) => {
              telefoneRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              TabelaPdfService.tabelaPdf(
                'telefonemas',
                'TELEFONEMAS',
                this.tabela.selectedColumns,
                telefoneRelatorio.telefones,
                telefonecampostexto
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
        let busca: TelefoneBuscaInterface = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = true;
        busca.first = undefined;
        busca.excel = true;
        let telefoneRelatorio: TelefonePaginacaoInterface;
        this.sub.push(this.postTelefoneRelatorio(busca)
          .subscribe({
            next: (dados) => {
              telefoneRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              ExcelService.criaExcelFile('telefonema', limpaCampoTexto(telefonecampostexto, telefoneRelatorio.telefones), this.tabela.selectedColumns);
            }
          })
        );
      }
    }
    if (this.telefones.length > 0 && td === 2) {
      ExcelService.criaExcelFile('telefonema', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.telefones), this.tabela.selectedColumns);
      return true;
    }
    if (this.selecionados !== undefined && this.selecionados.length > 0 && td === 1) {
      ExcelService.criaExcelFile('telefonema', limpaTabelaCampoTexto(this.tabela.selectedColumns,this.tabela.camposTexto,this.selecionados), this.tabela.selectedColumns);
      return true;
    }
  }

  exportToCsvTodos(td: boolean = true) {
    if (this.tabela.selectedColumns !== undefined && Array.isArray(this.tabela.selectedColumns) && this.tabela.selectedColumns.length > 0) {
      if (td === true) {
        let busca: TelefoneBuscaInterface = this.busca;
        busca.rows = undefined;
        busca.campos = this.tabela.selectedColumns;
        busca.todos = td;
        busca.first = undefined;
        let telefoneRelatorio: TelefonePaginacaoInterface;
        this.sub.push(this.postTelefoneRelatorio(busca)
          .subscribe({
            next: (dados) => {
              telefoneRelatorio = dados
            },
            error: err => {
              console.error('ERRO-->', err);
            },
            complete: () => {
              CsvService.jsonToCsv('proposicao', this.tabela.selectedColumns, telefoneRelatorio.telefones);

            }
          })
        );
      }
    }
  }

  customSort(ev) {
  }

  telefoneBusca(): void {
    this.tabela.sortField = (this.tabela.sortField === 'telefone_data') ? 'telefone_data2' : this.tabela.sortField;
    if (this.lazy && this.tabela.totalRecords <= +this.tabela.rows && this.busca.ids === this.tabela.ids && this.busca.first === this.tabela.first && +this.tabela.rows === +this.mudaRows) {
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        let tmp = this.telefones;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.telefones = tmp;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.telefones = tmp;
          }
        }
        if (+this.busca.sortOrder === +this.tabela.sortOrder && this.busca.sortField !== this.tabela.sortField) {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.telefones = tmp;
            this.tabela.sortOrder = 1;
          }
        }
      }
    } else {
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postTelefoneBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            // this.telefones = dados.telefones;
            this.telefones = dados.telefones.map((t) => {
              let p: TelefoneInterface = t;
              p.telefone_data3 = new Date(t.telefone_data2.replace(' ', 'T'));
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


  postTelefoneBusca(dados: TelefoneBuscaInterface): Observable<TelefonePaginacaoInterface> {
    const url = this.url.telefone + '/listar';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<TelefonePaginacaoInterface>(url, dados, httpOptions);
  }

  postTelefoneRelatorio(dados: TelefoneBuscaInterface): Observable<TelefonePaginacaoInterface> {
    const url = this.url.telefone + '/relatorio';
    const httpOptions = { headers: new HttpHeaders ({'Content-Type': 'application/json'}) };
    return this.http.post<TelefonePaginacaoInterface>(url, dados, httpOptions);
  }

  incluirTelefone(dados: TelefoneFormI): Observable<any[]> {
    const url = this.url.telefone;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.post<any[]> (url, dados, httpOptions);
  }

  alterarTelefone(dados: TelefoneFormI): Observable<any[]> {
    const url = this.url.telefone;
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json' }) };
    return this.http.put<any[]>(url, dados, httpOptions);
  }



  excluirTelefone(telefone_id: number): Observable<any[]> {
    const url = this.url.telefone + '/' + telefone_id;
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



  onDestroy(): void {
    sessionStorage.removeItem('telefone-busca');
    sessionStorage.removeItem('telefone-tabela');
    sessionStorage.removeItem('telefone-table');
    this.tfs.telefone = null;
    this.tfs.telefoneOld = null;
    this.tfs.telefoneListar = null;
    this.tabela = undefined;
    this.busca = undefined;
    this.selecionados = undefined;
    this.Contexto = undefined;
    this.stateSN = false;
    this.expandidoSN = false;
    this.sub.forEach(s => s.unsubscribe());
  }


/*

  criarTelefone() {
    this.tl = new TelefoneFormulario();
  }

  resetTelefone() {
    delete this.tl;
    this.criarTelefone();
  }

  filtraTelefone(): TelefoneFormulario {
    const and = new TelefoneFormulario();
    for (const key in and) {
      // @ts-ignore
      if (this.tl[key]) {
        // @ts-ignore
        if (this.tl[key] === null) {
          // @ts-ignore
          delete this.tl[key];
          // @ts-ignore
          delete and[key];
        } else {
          // @ts-ignore
          and[key] = this.tl[key];
        }
      } else {
        // @ts-ignore
        delete and[key];
      }
    }
    if (!and['telefone_resolvido']) {
      // @ts-ignore
      and['telefone_resolvido'] = +0;
    }
    return and;
  }

  getTelefoneDetalhe(telefone_id: number): Observable<TelefoneDetalheInterface> {
    const url = this.url.telefone + '/detalhe/' + telefone_id;
    return  this.http.get<TelefoneDetalheInterface>(url);
  }

  getTelefoneAlterar(telefone_id: number): Observable<TelefoneInterface> {
    const url = this.url.telefone + '/alterar/' + telefone_id;
    return this.http.get<TelefoneInterface>(url);
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('telefone-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(<string>sessionStorage.getItem('telefone-expandido'));
      sessionStorage.removeItem('telefone-expandido');
    }
    return resp;
  }

  gravaColunaExpandida(dados: any) {
    sessionStorage.setItem('telefone-expandido', JSON.stringify(dados));
  }

  montaColunaExpandida(ev: any[]) {
    const campo = [
      'telefone_assunto',
      'telefone_data',
      'telefone_ddd',
      'telefone_de',
      'telefone_id',
      'telefone_local_nome',
      'telefone_observacao',
      'telefone_para',
      'telefone_resolvido',
      'telefone_telefone',
      'telefone_tipo',
      'telefone_usuario_nome'
    ];
    const titulo = [
      'Assunto',
      'Data',
      'DDD',
      'De',
      'Id',
      'Núcleo',
      'Observações',
      'Para',
      'Resolvido',
      'Telefone',
      'Convenio',
      'Tipo',
      'Atendente'
    ];
    let a = 0;
    const b: any[] = [];

    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = campo.indexOf(v);
          if (n >= 0) {
            const cc: string[] = [];
            cc.push(titulo[n].toString());
            switch (v) {
              case 'telefone_tipo' : {
                switch (ev[v]) {
                  case 1 : {
                    ev[v] = 'RECEBIDO';
                    break;
                  }
                  case 2 : {
                    ev[v] = 'FEITA';
                    break;
                  }
                  default: {
                    ev[v] = 'FEITO';
                    break;
                  }
                }
                break;
              }
              case 'telefone_resolvido' : {
                switch (ev[v]) {
                  case 0 : {
                    ev[v] = 'RESOLVIDO';
                    break;
                  }
                  case 1 : {
                    ev[v] = 'NÃO RESOLVIDO';
                    break;
                  }
                  default: {
                    ev[v] = 'NÃO RESOLVIDO';
                    break;
                  }
                }
                break;
              }
            }
            cc.push(ev[v].toString());
            b.push(cc);
            a++;
          }
        }
      }
    }
    const tamanho = b.length;
    let linhas: number = tamanho;
    let colunas = 1;
    if (tamanho > 10) {
      colunas = 2;
      linhas = Math.ceil(tamanho / 2);
      if (linhas > 10) {
        colunas = 3;
        linhas = Math.ceil(tamanho / 3);
        if (linhas > 10) {
          colunas = 4;
          linhas = Math.ceil(tamanho / 4);
        }
      }
    }

    let col: number;
    let lin: number;
    const idxC = [];

    let contador = 0;
    for (col = 1; col <= colunas; col++) {
      const idcL = [];
      for (lin = 1; lin <= linhas; lin++) {
        if (contador < tamanho) {
          idcL.push(b[contador]);
        }
        contador++;
      }
      idxC.push(idcL);
    }
    const largura = (100 / colunas).toFixed(2) + '%';
    idxC.push(largura.toString());
    this.expandido.next(idxC);
  }

*/

}
