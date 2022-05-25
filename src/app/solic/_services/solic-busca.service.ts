import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SolicBuscaI} from "../_models/solic-busca-i";

@Injectable({
  providedIn: 'root'
})
export class SolicBuscaService {
  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;
  ct = 0;

  campos: string[];
  titulos: string[];
  cols: any[] = [];

  // solicitacaoBusca: SolicBuscaI;
  busca?: SolicBuscaI;
  expandidoDados: any = false;

  constructor() {
    this.criarBusca();
    this.buscaStateSN$.subscribe(vf => {
      this.stateSN = vf;
    });
    this.buscaState$.subscribe(dados => {
      this.state = dados;
    });
  }

  buscaMenu() {
    this.buscaSubject.next(true);
  }

  set buscaStateSN(dados: boolean) {
    this.buscaStateSNSubject.next(dados);
  }

  get buscaStateSN() {
    return this.stateSN;
  }

  set buscaState(dados: any) {
    this.buscaStateSubject.next(dados);
  }

  get buscaState(): any {
    return this.state;
  }

  criarBusca() {
    if (!this.busca) {
      this.busca = {
        todos: false,
        campos: [],
        ids: []
      }
    }
  }

  getState(): void {
    this.state = JSON.parse(sessionStorage.getItem('solicitacao-listagem'));
    console.log('state-->', this.state);
  }

  resetSolicitacaoBusca() {
    this.busca = {
      todos: false,
      campos: [],
      ids: []
    };
    this.buscaStateSN = false;
    sessionStorage.removeItem('solicitacao-listagem');
  }

  definirCampo() {
    this.campos = [];
    this.titulos = [];
    this.cols.forEach( x => {
      this.campos.push(x.field);
      this.titulos.push(x.header);
    });
  }

}
