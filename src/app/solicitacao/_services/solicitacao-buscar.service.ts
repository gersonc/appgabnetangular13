import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SolicitacaoBusca, SolicitacaoBuscaInterface } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class SolicitacaoBuscarService {

  buscaSubject = new BehaviorSubject<boolean>(true);
  busca$ = this.buscaSubject.asObservable();
  buscaStateSubject = new BehaviorSubject(null);
  buscaState$ = this.buscaStateSubject.asObservable();
  buscaStateSNSubject = new BehaviorSubject<boolean>(false);
  buscaStateSN$ = this.buscaStateSNSubject.asObservable();
  stateSN: boolean;
  state: any;
  ct = 0;

  solicitacaoBusca: SolicitacaoBuscaInterface;

  constructor() {
    this.buscaStateSN$.subscribe( vf => { this.stateSN = vf; });
    this.buscaState$.subscribe( dados => {this.state = dados; });
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

  criarSolicitacaoBusca() {
    if (!this.solicitacaoBusca) {
      this.solicitacaoBusca = new SolicitacaoBusca();
    }
  }

  resetSolicitacaoBusca() {
    this.solicitacaoBusca = new SolicitacaoBusca();
    this.buscaStateSN = false;
    sessionStorage.removeItem('solicitacao-busca');
  }
}
