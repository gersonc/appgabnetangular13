import { Injectable } from '@angular/core';
// import {SolicTotalInterface} from "../_models/solic-listar-i";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
// import {BuscaCampoI} from "../models/busca-campo-i";
import {MenuItem} from "primeng/api";
import {TotalI} from "../models/total-i";
import {BuscaGeneric, BuscaGenerica} from "../models/busca-generic";
import {ColunasI} from "../../_models/colunas-i";

@Injectable({
  providedIn: 'root'
})
export class DatatableService {
  rows = 50;
  first = 0;
  sortField = '';
  columnWidths: any[] = [];
  columnOrder: string[] = [];
  tableWidth = '';
  sortOrder = '';
  expandedRowKeys: any;
  selection: any[] = [];
  totalRecords = 50;
  currentPage = 1;
  pageCount = 1;

  busca?: BuscaGeneric;

  states: string[] = [];
  modulo = '';

  sub: Subscription[] = [];
  // listagemState: any;
  // expandidoDados: any = false;
  // cfg: number;
  // cfgVersao: number;
  campos: string[];
  titulos: string[];
  camposTexto: string[];
  camposSelecionados: ColunasI[];
  total: TotalI;

  cols: any[] = [];
  // numerodePaginas: number;
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: any[] = [];
  dadosExpandidosRaw: any;
  todos = false;




  sessaotable = '';
  sessaotabela = '';
  sessaoLinhaExpandida = '';
  sessaobusca = '';

  public expandido = new Subject();

  constructor() { }

  set Modulo(modulo: string) {
    this.busca = new BuscaGenerica();
    this.modulo = modulo;
    this.sessaobusca = modulo + '_' + 'sessaobusca';
    this.sessaotable = modulo + '-' +'table';
    this.sessaotabela = modulo + '-' +'tabela';
    this.sessaoLinhaExpandida = modulo + '-' +'Expandida';
  }

  get buscaStateSN(): boolean {
    return this.states.indexOf(this.modulo) !== -1;
  }

  getColunaExtendida(): Observable<any> {
    return this.expandido;
  }

  definirCampo() {
    this.campos = [];
    this.titulos = [];
    this.cols.forEach( x => {
      this.campos.push(x.field);
      this.titulos.push(x.header);
    });
  }

  set buscaStateSN(dados: boolean) {
    if (dados) {
      this.gravaSessao();
    } else {
      this.excluiSessao();
    }
  }

  /*set buscaState(dados: any) {
    this.buscaStateSubject.next(dados);
  }*/

  getState() {
    this.recuperaSessao();
  }

  resetBusca() {
    this.busca = new BuscaGenerica();
  }




  onRowExpand(evento){
    console.log('onRowExpand', evento);
    let a = 0;
    const b: any[] = [];
    let ev = evento.data;
    this.dadosExpandidos = evento.data;
    for (const v in ev) {
      if (ev[v] !== null) {
        if (ev[v].toString().length > 0) {
          const n = this.campos.indexOf(v);
          const m = this.camposTexto.indexOf(v);
          if (n >= 0) {
            const cc: any[] = [];
            const tit = this.titulos[n].toString();
            let vf = false;
            let txtdelta: string = null;
            let txt: string = null;
            let tst = '';
            // cc.push(this.titulos[n].toString());
            if (m >= 0) {
              let keyidx: string[] = [
                this.camposTexto[m],
                this.camposTexto[m] + '_texto',
                this.camposTexto[m] + '_delta'
              ];
              tst = (ev[keyidx[1]]) ? ev[keyidx[1]] : ev[keyidx[0]];
              txt = (ev[keyidx[1]]) ? ev[ev[keyidx[1]]] : null;
              txtdelta = (ev[keyidx[2]]) ? ev[ev[keyidx[2]]] : null;
              vf = true;
            } else {
              tst = ev[v].toString();
            }
            b.push([tit, tst, vf, txt, txtdelta]);
            a++;
          }
        }
      }
    }
    // console.log('montaColunaExpandida1', this.dadosExpRaw);
    //let d = b.pop();
    // console.log('montaColunaExpandida2', b);
    this.dadosExpandidos = b;
  }



  gravaColunaExpandida() {
    sessionStorage.setItem(this.sessaoLinhaExpandida, JSON.stringify(this.dadosExpandidos));
  }


  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem(this.sessaoLinhaExpandida)) {
      resp = false;
    } else {
      this.dadosExpandidos = JSON.parse(sessionStorage.getItem(this.sessaoLinhaExpandida));
      sessionStorage.removeItem(this.sessaoLinhaExpandida);
    }
  }

  excluirColunaExpandida() {
      sessionStorage.removeItem(this.sessaoLinhaExpandida);
      this.dadosExpandidos = [];
      this.expandedRowKeys = null;
  }






  /*onRowExpand(event): void {
    this.montaColunaExpandida(event.data);
  }*/

  onDestroy(): void {
    this.excluiSessao();
    this.sub.forEach(s => s.unsubscribe());
    this.resetDatatableService();
  }

  resetDatatableService() {
    console.log(this.cols);
    sessionStorage.removeItem(this.sessaoLinhaExpandida);
    this.sub = [];
    // this.listagemState = null;
    // this.expandidoDados = false;
    this.campos = [];
    this.titulos = [];
    this.camposTexto = [];
    this.camposSelecionados = [];
    this.total = undefined;
    this.totalRecords = 0;
    this.currentPage = 1;
    this.cols = [];
    this.first = 0;
    this.rows = 50;
    this.sortField = '';
    this.selectedColumns = [];
    this.selectedColumnsOld = [];
    this.mostraSeletor = false;
    this.numColunas = 3;
    this.expColunas = 0;
    this.dadosExpandidos = undefined;
    this.todos = false;
    // this.expandido = new Subject();
    this.busca = new BuscaGenerica();
    this.sessaotable = '';
    this.sessaotabela = '';
    this.sessaoLinhaExpandida = '';
    this.sessaobusca = '';
  }


  gravaSessao() {
    sessionStorage.removeItem(this.sessaotabela);
    sessionStorage.removeItem(this.sessaobusca);
    if (this.states.indexOf(this.modulo) === -1) {
      this.states.push(this.modulo);
    }
    const sessao: any = {
      cols: this.cols,
      dadosExpandidos: this.dadosExpandidos,
      dadosExpandidosRaw: this.dadosExpandidosRaw,
      // cfg: this.cfg,
      // cfgVersao: this.cfgVersao,
      campos: this.campos,
      titulos: this.titulos,
      camposTexto: this.camposTexto,
      selectedColumns: this.selectedColumns,
      selectedColumnsOld: this.selectedColumnsOld,
      camposSelecionados: this.camposSelecionados,
      total: this.total,
    }
    this.gravaColunaExpandida();
    sessionStorage.setItem(this.sessaotabela, JSON.stringify(sessao));
    sessionStorage.setItem(this.sessaobusca, JSON.stringify(this.busca));
  }

  recuperaSessao() {
    this.states.splice(this.states.indexOf(this.modulo),1);
    this.recuperaColunaExpandida()
    this.busca = JSON.parse(sessionStorage.getItem(this.sessaobusca));
    const sessao = JSON.parse(sessionStorage.getItem(this.sessaotabela));
      this.cols = sessao.cols;
      this.dadosExpandidos = sessao.dadosExpandidos;
      this.dadosExpandidosRaw = sessao.dadosExpandidosRaw;
      // this.cfg = +sessao.cfg;
      // this.cfgVersao = +sessao.cfgVersao;
      this.campos = sessao.campos;
      this.titulos = sessao.titulos;
      this.camposTexto = sessao.camposTexto;
      this.selectedColumns = sessao.selectedColumns;
      this.selectedColumnsOld = sessao.selectedColumnsOld;
      this.camposSelecionados = sessao.camposSelecionados;
      this.total = sessao.total;
      sessionStorage.removeItem(this.sessaotabela);
      // sessionStorage.removeItem(this.sessaotable);
  }


  excluiSessao() {
    sessionStorage.removeItem(this.sessaotabela);
    sessionStorage.removeItem(this.sessaotable);
    sessionStorage.removeItem(this.sessaobusca);
    this.excluirColunaExpandida();
    this.states.splice(this.states.indexOf(this.modulo));
  }


}
