import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

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

  // solicitacaoBusca: SolicBuscaI;
  busca: any = {};
  expandidoDados: any = false;

  constructor() {
    this.busca = {
      todos: true,
      campos: [],
      ids: []
    }
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

  get buscaState() {
    return this.state;
  }

  criarBusca() {
    if (!this.busca) {
      this.busca = {};
    }
  }

  getState(): void {
    this.state = JSON.parse(sessionStorage.getItem('solicitacao-listagem'));
    console.log('state-->', this.state);
  }

  resetSolicitacaoBusca() {
    this.busca = {};
    this.buscaStateSN = false;
    sessionStorage.removeItem('solicitacao-listagem');
  }

}
