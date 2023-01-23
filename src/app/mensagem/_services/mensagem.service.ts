import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Datatable, DatatableI} from "../../_models/datatable-i";
import {take} from "rxjs/operators";
import {TarefaFormI, TarefaPaginacaoI} from "../../tarefa/_models/tarefa-i";
import {MensagemListagemI, MensagemPaginacaoI} from "../_models/mensagem-listagem-i";
import {MansagemBuscaI} from "../_models/mansagem-busca-i";


@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  idx?: number;
  mensagemUrl = this.url.mensagem;
  sub: Subscription[] = [];
  mensagens: MensagemListagemI[] = [];
  selecionados: MensagemListagemI[] = [];
  Contexto: MensagemListagemI;
  busca?: MansagemBuscaI;
  tabela?: DatatableI;
  stateSN = false;
  sortField = 'mensagem_data2';
  sortOrder = -1;
  lazy = true;
  acao: string | null = null;
  colunas: string[] = [];
  mudaRows = 50;
  rowsPerPageOptions = [50];
  listagem_tipo = 'recebidas';
  showExcluir = false;
  // formatterBRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'});



  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) {
    this.mensagemUrl = this.url.mensagem;
  }

  buscaMenu() {
    this.mensagemBusca();
  }

  criaTabela() {
    if (this.tabela === undefined) {
      this.tabela = new Datatable();
      if (this.stateSN) {
        this.criaBusca();
      } else {
        this.tabela.sortField = 'mensagem_data2';
        this.tabela.sortOrder = -1;
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

  novaBusca(busca: MansagemBuscaI) {
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
      if (this.busca.sortField === 'mensagem_data3') {
        if (this.busca.sortField === 'mensagem_data3') {
          this.busca.sortField = 'mensagem_data2';
        }
        if (this.busca.sortOrder !== undefined) {
          this.busca.sortOrder = -1;
        }
      }
      if (this.busca.sortField === undefined) {
        this.busca.sortOrder = -1;
        this.busca.sortField = 'mensagem_data2';
      }

    }
    console.log('novaBusca2',this.busca);
  }

  resetMensagemBusca() {
    this.lazy = false;
    this.busca = undefined;
    this.criaBusca();
  }





  parseBusca(b: MansagemBuscaI) {
    this.busca.todos = (b.todos !== undefined) ? b.todos : undefined;
    this.busca.rows = (b.rows !== undefined) ? +b.rows : undefined;
    this.busca.sortField = (b.sortField !== undefined) ? b.sortField : undefined;
    this.busca.first = (b.first !== undefined) ? +b.first : undefined;
    this.busca.sortOrder = (b.sortOrder !== undefined) ? +b.sortOrder : undefined;
    this.busca.mensagem_id = (b.mensagem_id !== undefined) ? +b.mensagem_id : undefined;
    this.busca.tipo_listagem = (b.tipo_listagem !== undefined) ? +b.tipo_listagem : undefined;
    this.busca.mensagem_titulo = (b.mensagem_titulo !== undefined) ? b.mensagem_titulo : undefined;
    this.busca.usuario_mensagem_id = (b.usuario_mensagem_id !== undefined) ? +b.usuario_mensagem_id : undefined;
    this.busca.usuario_mensagem_usuario_id = (b.usuario_mensagem_usuario_id !== undefined) ? +b.usuario_mensagem_usuario_id : undefined;
    this.busca.usuario_id = (b.usuario_id !== undefined) ? b.usuario_id : undefined;
    //this.busca.usuario_mensagem_visto = (b.usuario_mensagem_visto !== undefined) ? b.usuario_mensagem_visto : undefined;
    this.busca.mensagem_titulo = (b.mensagem_titulo !== undefined) ? b.mensagem_titulo : undefined;
    this.busca.mensagem_data1 = (b.mensagem_data1 !== undefined) ? b.mensagem_data1 : undefined;
    this.busca.mensagem_data2 = (b.mensagem_data2 !== undefined) ? b.mensagem_data2 : undefined;
    this.mensagemBusca();
  }



  mensagemBusca(): void {
    console.log('mensagemBusca',this.busca );
    if (this.lazy &&
      this.tabela.totalRecords <= +this.tabela.rows &&
      this.busca.ids === this.tabela.ids &&
      this.busca.first === this.tabela.first &&
      +this.tabela.rows === +this.mudaRows) {
      this.tabela.sortField = 'mensagem_data3';
      if (+this.busca.sortOrder !== +this.tabela.sortOrder || this.busca.sortField !== this.tabela.sortField) {
        this.lazy = false;
        const tmp = this.mensagens;
        if (+this.busca.sortOrder !== +this.tabela.sortOrder && this.busca.sortField === this.tabela.sortField) {
          // if (+this.busca.sortOrder !== +this.tabela.sortOrder) {
          this.busca.sortOrder = +this.tabela.sortOrder;
          if (+this.tabela.sortOrder === 1) {
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.mensagens = tmp;
            this.lazy = true;
          } else {
            tmp.sort((first, second) => (second[this.tabela.sortField] > first[this.tabela.sortField]) ? 1 : ((first[this.tabela.sortField] > second[this.tabela.sortField]) ? -1 : 0));
            this.mensagens = tmp;
            this.lazy = true;
          }
        } else {
          if (this.busca.sortField !== this.tabela.sortField) {
            this.busca.sortField = this.tabela.sortField;
            this.busca.sortOrder = 1;
            tmp.sort((first, second) => (first[this.tabela.sortField] > second[this.tabela.sortField]) ? 1 : ((second[this.tabela.sortField] > first[this.tabela.sortField]) ? -1 : 0));
            this.mensagens = tmp;
            this.tabela.sortOrder = 1;
            this.lazy = true;
          }
        }
      }
    } else {
      this.tabela.sortField = 'mensagem_data2';
      this.busca.rows = this.tabela.rows;
      this.busca.first = this.tabela.first;
      this.busca.sortOrder = this.tabela.sortOrder;
      this.busca.sortField = this.tabela.sortField;
      if (this.busca.todos === undefined && this.tabela.todos === undefined) {
        this.busca.todos = false;
        this.tabela.todos = false;
      }
      this.busca.ids = this.tabela.ids;
      this.sub.push(this.postMensagemBusca(this.busca)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.mensagens = dados.mensagens.map((t) => {
              const p: MensagemListagemI = t;
              p.mensagem_data3 = new Date(t.mensagem_data2);
              return p;
            });
            this.listagem_tipo = (this.busca.tipo_listagem === 2) ? 'recebidas' : 'enviadas';
            this.tabela.total = dados.total;
          },
          error: err => console.error('ERRO-->', err),
          complete: () => {
            this.lazy = false;
            console.log('mensagemBusca', this.mensagens);
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

  postMensagemBusca(dados: MansagemBuscaI): Observable<MensagemPaginacaoI> {
    const url = this.url.mensagem + '/listar';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<MensagemPaginacaoI>(url, dados, httpOptions);
  }


  incluirMensagem(dados: TarefaFormI): Observable<any[]> {
    const url = this.url.mensagem + '/incluir';
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<any[]>(url, dados, httpOptions);
  }



  excluirMensagemUsuario(mensagem_id: number): Observable<any[]> {
    const url = this.url.mensagem + '/destinatario/' + mensagem_id;
    return this.http.delete<any[]>(url);
  }

  excluirMensagemRemetente(mensagem_id: number): Observable<any[]> {
    const url = this.url.mensagem + '/remetente/' + mensagem_id;
    return this.http.delete<any[]>(url);
  }

  excluirMensagemRemetenteTodos(mensagem_id: number): Observable<any[]> {
    const url = this.url.mensagem + '/todas/' + mensagem_id;
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

  /*filtraTarefa(d: TarefaFormI): TarefaFormI {
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
  }*/

  onDestroy(): void {
      this.tabela = undefined;
      this.busca = undefined;
      this.mensagens = [];
    this.sub.forEach(s => s.unsubscribe());
  }
}
