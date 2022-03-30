import { Injectable } from '@angular/core';
import {SolicListarI, SolicTotalInterface} from "../_models/solic-listar-i";
import {Observable, Subject, Subscription} from "rxjs";

import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class SolicDatatableService {
  sub: Subscription[] = [];
  // solicitacoes: SolicListarI[];
  buscaState: any;
  buscaStateSN = false;
  listagemState: any;
  expandidoDados: any = false;
  cfg: number;
  cfgVersao: number;
  campos: string[];
  titulos: string[];
  camposTexto: string[];
  // camposSelecionados: SolicBuscaCampoI[];
  // selecionados: SolicListarI[] = [];
  total: SolicTotalInterface;
  totalRecords = 0;
  currentPage = 1;
  cols: any[];
  numerodePaginas: number;
  first: number;
  rows = 50;
  // Contexto: SolicListarI;
  sortCampo = '';
  selectedColumns: any[] = [];
  selectedColumnsOld: any[] = [];
  mostraSeletor = false;
  numColunas = 3;
  expColunas = 0;
  dadosExpandidos: Subscription;
  dadosExp: any[];
  itemsAcao: MenuItem[];
  contextoMenu: MenuItem[];
  tmp = false;
  camposEditor?: string[];

  public expandido = new Subject();

  constructor() { }

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


  onRowExpand(evento){
    // this.expColunas = dados.pop();
    let a = 0;
    const b: any[] = [];
    let ev = evento.data;
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
    console.log('montaColunaExpandida1', b);
    //let d = b.pop();
    console.log('montaColunaExpandida2', b);
    this.dadosExp = b;
  }



  gravaColunaExpandida(dados) {
    sessionStorage.setItem('solic-expandido', JSON.stringify(dados));
  }


  recuperaColunaExpandida() {
    let resp: any;
    if (!sessionStorage.getItem('solic-expandido')) {
      resp = false;
    } else {
      resp = JSON.parse(sessionStorage.getItem('solic-expandido'));
      sessionStorage.removeItem('solic-expandido');
    }
    return resp;
  }

  excluirColunaExpandida() {
    if (sessionStorage.getItem('solic-expandido')) {
      sessionStorage.removeItem('solic-expandido');
    }
    if (sessionStorage.getItem('solic-listagem')) {
      const resp = JSON.parse(sessionStorage.getItem('solic-listagem'));
      if (resp.expandedRowKeys) {
        delete resp.expandedRowKeys;
        sessionStorage.setItem('solic-listagem', JSON.stringify(resp));
      }
    }
  }




  /*onRowExpand(event): void {
    this.montaColunaExpandida(event.data);
  }*/

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


}
